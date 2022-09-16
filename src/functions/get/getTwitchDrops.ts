import {timebased} from "../../Data/userdata";
import {userdata} from "../../index";
import winston from "winston";
import chalk from "chalk";
import {claimedstatustoString, getRandomInt, livechresponse, statustoString} from "../../utils/util";
import {findLiveChannel} from "../findLiveChannel";
import {claimableCheck, matchClaimedDrops} from "../../Checks/claimCheck";
import {dateCheck} from "../../Checks/dateCheck";

const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
const inquirer = require("inquirer");

export async function getTwitchDrops(game: string, feedback: boolean) {
    userdata.drops = []

    let dropidstoget:Array<string> = [];

    const DropCampaignDetails = await TwitchGQL._SendQuery("ViewerDropsDashboard", {}, '', 'OAuth ' + userdata.auth_token, true, {}, true)
    userdata.userid = DropCampaignDetails[0].data.currentUser.id
    let allDropCampaings = DropCampaignDetails[0].data.currentUser.dropCampaigns
    if (userdata.settings.debug) winston.info('DropCampain %o', JSON.stringify(DropCampaignDetails,null, 2))

    await allDropCampaings.forEach((campaign: Campaign) => {
        if (campaign.status === 'ACTIVE') {
            if (campaign.game.displayName === game) {
                dropidstoget.push(campaign.id)
            }
        }
    })
    if (feedback) {
        winston.silly(" ")
        winston.info(chalk.gray('Getting all available Drops...'), {event: "get"})
    }
    for (const e of dropidstoget) {
        let opts = {
            channelLogin: userdata.userid,
            dropID: e
        }
        const DropDetails = await TwitchGQL._SendQuery("DropCampaignDetails", opts, 'f6396f5ffdde867a8f6f6da18286e4baf02e5b98d14689a69b5af320a4c7b7b8', 'OAuth ' + userdata.auth_token, true, {}, true)
        let CampaignDetails = DropDetails[0].data.user.dropCampaign

        userdata.drops.push({
            dropid: CampaignDetails.id,
            dropname: CampaignDetails.name,
            Connected: CampaignDetails.self.isAccountConnected,
            allowedchannels: CampaignDetails.allow.channels,
            timebasedrop: CampaignDetails.timeBasedDrops,
            live: false,
            foundlivech: [],
            isClaimed: false
        })
    }
    if (feedback) {
        winston.silly(" ")
        winston.info(chalk.gray('Looking for a Live Channel...'), {event: "get"})
    }
    //Check if drop has a Live channel
    for (const e of userdata.drops) {
        let livechs = await findLiveChannel(e.allowedchannels)
        if (livechs.length !== 0) {
            e.live = true;
            e.foundlivech.push(livechs[0])
        } else {
            e.live = false;
        }
    }

    if (feedback) {
        winston.silly(" ")
        winston.info(chalk.gray('Checking your Inventory for started Drops...'), {event: "get"})
    }
    //Check if drop is started if so get data and set it
    const rawInventory = await TwitchGQL._SendQuery("Inventory", {}, '27f074f54ff74e0b05c8244ef2667180c2f911255e589ccd693a1a52ccca7367', 'OAuth ' + userdata.auth_token, true, {}, true)
    let Inventory = rawInventory[0].data.currentUser.inventory
    if (userdata.settings.debug) winston.info('rawinventory %o', JSON.stringify(rawInventory,null, 2))
    Inventory.gameEventDrops.forEach((claimeddrop: GameEventDrops) => {
        userdata.claimedDrops.push({
            id: claimeddrop.id,
            imageurl: claimeddrop.imageURL,
            name: claimeddrop.name,
            game: claimeddrop.game
        })
    })


    //Match inventory drops in progress to the right Drops
    userdata.drops.forEach(DropElement => {
        if (Inventory.dropCampaignsInProgress !== null) {
            Inventory.dropCampaignsInProgress.forEach((e: DropCampaignsInProgress) => {
                if (DropElement.dropid === e.id) {
                    DropElement.timebasedrop = e.timeBasedDrops;
                }
            })
        } else {
            if (userdata.settings.debug) winston.info('No Drops in Progress...')
        }
    })

    //Make sure self object exits
    userdata.drops.forEach(drop => {
        drop.timebasedrop.forEach(time => {
            if (!("self" in time)) {
                time['self'] = {
                    __typename: "TimeBasedDropSelfEdge",
                    currentMinutesWatched: 0,
                    dropInstanceID: null,
                    isClaimed: null
                }
            }
        })
    })


    if (feedback) {
        winston.silly(" ")
        winston.info(chalk.gray('Checking your Inventory for claimed Drops...'), {event: "get"})
    }
    await matchClaimedDrops()
    //Update Date Status
    for (const drop of userdata.drops) {
        await dateCheck(drop, true)
        await claimableCheck(drop, userdata.settings.AutoClaim, true)
    }

    //Log Result
    if (feedback) {
        userdata.drops.forEach(drop => {
            winston.silly(" ")
            winston.info(livechresponse(drop.foundlivech) + " | " + chalk.magenta(drop.dropname)  + " | " + statustoString(drop.live) + ' | ' + claimedstatustoString(drop.isClaimed),  {event: "getResult"})
        })
    }

}

export async function askWhatDropToStart(random: boolean, filterlive: boolean, filterNonActive: boolean, filterlast: boolean) {
    userdata.availableDropNameChoices = []
    userdata.drops.forEach(drop => {
        if (filterlive) {
            if (drop.live) {
                userdata.availableDropNameChoices.push(drop.dropname)
            }
        } else {
            userdata.availableDropNameChoices.push(drop.dropname)
        }
    })

    if (filterNonActive) {
        for (const [i, DropName] of userdata.availableDropNameChoices.entries()) {
            if (userdata.nonActiveDrops.includes(DropName)){
                userdata.availableDropNameChoices.splice(i, 1)
                winston.silly(" ")
                winston.info(chalk.yellow(DropName + ' | ' + 'was removed because the drop ended or not started yet...'))
            }
        }
    }

    if (filterlast) {
        for (const [i, choice] of userdata.availableDropNameChoices.entries()) {
            if (choice === userdata.startDrop) {
                userdata.availableDropNameChoices.splice(i, 1)
            }
        }
    }

    if (userdata.availableDropNameChoices.length === 0) {
        winston.silly(" ")
        winston.info(chalk.gray('All available Channels Offline... Select any Drop to start watching...'))
        userdata.drops.forEach(drop => {
            userdata.availableDropNameChoices.push(drop.dropname)
        })
    }

    winston.silly(" ")
    if (!random) {
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'namelist',
                    message: 'What Drop do you wanna start Watching?',
                    choices: userdata.availableDropNameChoices,
                },
            ])
            .then(async (answer: {namelist: string}) => {
                userdata.startDrop = answer.namelist
            });
    } else {
        userdata.startDrop = userdata.availableDropNameChoices[getRandomInt(userdata.availableDropNameChoices.length)]
        winston.info(chalk.gray('Selected a random drop to watch: ' + chalk.white(userdata.startDrop)))
    }

}


export async function askWhatGameToWatch(random: boolean) {
    let activecampainnames = await getActiveCampaigns();

    winston.silly(" ")
    if (!userdata.settings.displayless) {
        if (!random) {
            await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'namelist',
                        message: 'What Game do you wanna watch?',
                        choices: activecampainnames,
                    },
                ])
                .then(async (answer: {namelist: string}) => {
                    userdata.game = answer.namelist
                });
        } else {
            userdata.game = activecampainnames[getRandomInt(userdata.availableDropNameChoices.length)]
            winston.info(chalk.gray('Selected a random game to watch: ' + chalk.white(userdata.game)))
        }
    } else {
        if (userdata.settings.Prioritylist.length === 0) {
            winston.warn(chalk.yellow('Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings...'))
            userdata.game = activecampainnames[getRandomInt(userdata.availableDropNameChoices.length)]
            winston.info(chalk.gray('Selected a random Game to watch: ' + chalk.white(userdata.game)))
        } else {
                userdata.game = userdata.settings.Prioritylist[0]
                winston.info(chalk.gray('Selected a Game from your Priority List watch: ' + userdata.game))
        }
    }
}

export async function getActiveCampaigns() {
    let activecampainnames:Array<string> = [];
    winston.silly(" ")
    winston.info(chalk.gray('Getting all active Campaigns...'), {event: "get"})
    const DropCampaignDetails = await TwitchGQL._SendQuery("ViewerDropsDashboard", {}, '', 'OAuth ' + userdata.auth_token, true, {}, true)
    let allDropCampaings = DropCampaignDetails[0].data.currentUser.dropCampaigns
    await allDropCampaings.forEach((campaign: Campaign) => {
        if (campaign.status === 'ACTIVE') {
            if (activecampainnames.includes(campaign.game.displayName) === false) {
                activecampainnames.push(campaign.game.displayName)
            }
        }
    })
    if (userdata.settings.Prioritylist.length > 0) {
        for (let i = userdata.settings.Prioritylist.length; i--;) {
            if (!activecampainnames.includes(userdata.settings.Prioritylist[i])) {
                winston.info(chalk.yellow("Removed " + userdata.settings.Prioritylist[i] + " from the Priority List, because there is no ACTIVE campaign with such name."))
                userdata.settings.Prioritylist.splice(i, 1);
            }
        }
    }
    return activecampainnames;
}


type Campaign = {
    id: string,
    name: string,
    owner: {
        id: string,
        name: string,
        __typename: string
    },
    game: {
        id: string,
        displayName: string,
        boxArtURL: string,
        __typename: string
    },
    status: string,
    startAt: string,
    endAt: string,
    detailsURL: string,
    accountLinkURL: string,
    self: Object,
    __typename: string
}

type DropCampaignsInProgress = {
    id: string,
    name: string,
    status: string,
    timeBasedDrops: Array<timebased>
}

type GameEventDrops = {
    game: Object,
    id: string,
    imageURL: string,
    isConnected: boolean,
    lastAwardedAt: string,
    name: string,
    requiredAccountLink: string,
    totalCount: string,
    __typename: string
}