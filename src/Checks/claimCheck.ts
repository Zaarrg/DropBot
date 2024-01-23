import {Drop} from "../functions/get/getCurrentDrop";
import winston from "winston";
import chalk from "chalk";
import {restartHandler} from "../functions/handler/restartHandler";
import {userdata} from "../index" ;
import {delay} from "../utils/util";
const GQL = require("@zaarrg/gql-dropbot").Init();

export async function claimableCheck(CurrentDrop: Drop, autoclaim: boolean, onlycheck: boolean) {
    //filter all non active drops
    let nonworkingamount = 0;
    let notavaiableyet = 0;
    let preconditions = false;
    CurrentDrop.timebasedrop.forEach(timedrop => {
        if (!timedrop.self.isClaimed && timedrop.self.status === 'Not Active' || !timedrop.self.isClaimed && timedrop.self.status === 'Ended') {
            nonworkingamount++
        }
        if (!timedrop.self.isClaimed && timedrop.self.status === 'Not Active') {
            notavaiableyet++
        }
        if (timedrop.preconditionDrops !== null) {
            preconditions = true
        }
    })

    let workingdropslenght = (CurrentDrop.timebasedrop.length - nonworkingamount)
    let hundredpercent = 0;
    let isclaimedamount = 0;

    for (const timedrop of CurrentDrop.timebasedrop) {
        if (timedrop.requiredMinutesWatched === timedrop.self.currentMinutesWatched) {
            hundredpercent++
        }
        if (timedrop.self.isClaimed) {
            isclaimedamount++
        }

        if (autoclaim || preconditions) {
            //Auto Claim if possible
            for (const benefit of timedrop.benefitEdges) {
                if (timedrop.self.currentMinutesWatched === timedrop.requiredMinutesWatched && timedrop.self.dropInstanceID !== null) {

                    let opts = {
                        "input":{
                            "dropInstanceID": timedrop.self.dropInstanceID.toString()
                        }
                    }
                    await GQL._SendQuery("DropsPage_ClaimDropRewards", opts, 'a455deea71bdc9015b78eb49f4acfbce8baa7ccbedd28e549bb025bd0f751930', 'OAuth ' + userdata.auth_token, true, {}, true)
                    if (autoclaim) winston.info(chalk.gray('Claimed ' + chalk.green(timedrop.name)), {event: "claim"})
                    if (preconditions && !autoclaim) winston.info(chalk.gray('Claimed ' + chalk.green(timedrop.name) + ' because otherwise cant watch next drop...'), {event: "claim"})
                }
            }
        }
    }

    //Check if all Drops of the game are claimed/claimable
    if (userdata.settings.debug) winston.info('Claim CHECK ONE ' + hundredpercent + ' | ' + workingdropslenght + ' | ' + isclaimedamount + ' | ' + nonworkingamount + ' | ' + notavaiableyet)
    if (!onlycheck) await allgameddropsclaimableCheck()

    //All Claimable
    if (workingdropslenght !== CurrentDrop.timebasedrop.length && notavaiableyet >= (isclaimedamount + hundredpercent)) {
        if (!onlycheck) {
            winston.silly(" ")
            winston.info(chalk.green('Got all available Drops, missing Drops are not active yet... Looking for new ones...'), {event: "newDrop"})
            await restartHandler(true, true, true, true, false)
        }
    } else if (workingdropslenght === 0 ) {
        if (!onlycheck) {
            winston.silly(" ")
            winston.info(chalk.green('All available Drops for Current Drop are unavailable... Looking for new ones...'), {event: "newDrop"})
            await restartHandler(true, true, true, true, false)
        }
    } else if (hundredpercent >= workingdropslenght) {
        if (!onlycheck) {
            winston.silly(" ")
            winston.info(chalk.green('All available Drops for Current Drop Claimable... Looking for new ones...'), {event: "newDrop"})
            await restartHandler(true, true, true, true, false)
        }
    } else if (isclaimedamount >= workingdropslenght) {
        CurrentDrop.isClaimed = true
        if (!onlycheck) {
            winston.silly(" ")
            winston.info(chalk.green('All Drops for Current Drop Claimed... Looking for new ones...'), {event: "newDrop"})
            await restartHandler(true, true, true, true, false)
        }
    } else if ( (isclaimedamount + hundredpercent) >=workingdropslenght) {
        if (!onlycheck) {
            winston.silly(" ")
            winston.info(chalk.green('All available Drops for Current Drop Claimable or Claimed... Looking for new ones...'), {event: "newDrop"})
            await restartHandler(true, true, true, true, false)
        }
    } else {
        nonworkingamount = 0;
        hundredpercent = 0;
        isclaimedamount = 0;
    }
}

async function allgameddropsclaimableCheck() {
    let nonworkingamount = 0;
    let amount = 0;
    let isclaimedorclaimableamount = 0;
    let offlinedrops = 0;
    for (const drop of userdata.drops) {
        //filter all non active drops
        drop.timebasedrop.forEach(timedrop => {
            amount++
            if (!timedrop.self.isClaimed && timedrop.self.status === 'Not Active' || !timedrop.self.isClaimed && timedrop.self.status === 'Ended') {
                nonworkingamount++
            } else if (timedrop.requiredMinutesWatched === timedrop.self.currentMinutesWatched || timedrop.self.isClaimed === true) {
                isclaimedorclaimableamount++
            } else if (timedrop.self.status === 'Active' && !drop.live) {
                offlinedrops++
            }
        })


    }

    if (userdata.settings.debug) winston.info('Claim CHECK LOOP ' + isclaimedorclaimableamount + ' | ' + amount + ' | ' + nonworkingamount + ' | ' + offlinedrops)
    if ( isclaimedorclaimableamount >= (amount-nonworkingamount)) {
        winston.silly(" ")
        if (userdata.settings.Prioritylist.length === 0) winston.warn(chalk.yellow('Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings... or disable this feature in the settings...'))
        winston.info(chalk.green('All available drops of the game claimed or claimable... Looking for a new Game....'), {event: "newGame"})
        await restartHandler(true, true, true, true, true)
    } else if (isclaimedorclaimableamount >= ((amount-nonworkingamount)-offlinedrops)) {
        winston.silly(" ")
        if (userdata.settings.WaitforChannels) {
            winston.info(chalk.green('All available Live Drops of the game claimed or claimable... Looking for new Live Drop in 5 Minutes....'), {event: "newDrop"})
            winston.silly(' ', {event: "progressEnd"})
            await delay(300000)
            await restartHandler(true, true, true, true, false)
        } else {
            if (userdata.settings.Prioritylist.length === 0) winston.warn(chalk.yellow('Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings...'))
            winston.info(chalk.green('All available Live Drops of the game claimed or claimable... Looking for a new Game....'), {event: "newGame"})
            await restartHandler(true, true, true, true, true)
        }
    }
}



export async function matchClaimedDrops() {
    //Check if Drop isclaimed
    userdata.claimedDrops.forEach(claimeddrop => {
        userdata.drops.forEach(drop => {
            drop.timebasedrop.forEach(timebasedrop => {
                timebasedrop.benefitEdges.forEach(benefit => {
                    if (claimeddrop.imageurl.toString() === benefit.benefit.imageAssetURL.toString()) {
                        for (const [i, drops] of drop.timebasedrop.entries()) {
                            if (drops.self.isClaimed === null) {
                                drop.isClaimed = true;
                            }
                        }
                    }
                })
            })
        })
    })

    userdata.drops.forEach(drop => {
        drop.timebasedrop.forEach(timebasedrop => {
            if (drop.isClaimed && timebasedrop.self.isClaimed === null) {
                timebasedrop['self'] = {
                    __typename: "TimeBasedDropSelfEdge",
                    currentMinutesWatched: 0,
                    dropInstanceID: null,
                    isClaimed: true
                }
            }
        })
    })
}