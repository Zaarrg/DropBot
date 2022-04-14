import {WatchingEventHandlerStop} from "./watchpageHandler";
import {askWhatDropToStart, askWhatGameToWatch, getActiveCampaigns, getTwitchDrops} from "../get/getTwitchDrops";
import {startWatching} from "../startWatching";
import {userdata} from "../../index" ;
import winston from "winston";
import chalk from "chalk";
import {delay, getRandomInt} from "../../utils/util";


export async function restartHandler(random: boolean, filterlive: boolean, filterNonActive: boolean, filterlast: boolean, newgame: boolean) {
    if (!newgame) {
        await WatchingEventHandlerStop()
        await askWhatDropToStart(random, filterlive, filterNonActive, filterlast)
        await startWatching()
    } else if (newgame && userdata.settings.Prioritylist.length > 0) {
        await WatchingEventHandlerStop()
        await selectGamefromList()
        await getTwitchDrops(userdata.game, true).then(async () => {
            await askWhatDropToStart(random, filterlive, filterNonActive, filterlast)
            await startWatching()
        })
    } else {
        await WatchingEventHandlerStop()
        await askWhatGameToWatch(true)
        await getTwitchDrops(userdata.game, true).then(async () => {
            await askWhatDropToStart(random, filterlive, filterNonActive, filterlast)
            await startWatching()
        })
    }
}

async function selectGamefromList() {
    let activecampainnames = await getActiveCampaigns();

    if (userdata.settings.Prioritylist.length === 0) {
        winston.warn(chalk.yellow('Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings...'))
        userdata.game = activecampainnames[getRandomInt(userdata.availableDropNameChoices.length)]
        winston.info(chalk.gray('Selected a random Game to watch: ' + chalk.white(userdata.game)))
    } else {
        let gameselected = ''
        for (const [i, game] of userdata.settings.Prioritylist.entries()) {
            if (userdata.game === game) {
                if ((userdata.settings.Prioritylist.length-1) === i) {
                    gameselected = userdata.settings.Prioritylist[0]
                } else {
                    gameselected = userdata.settings.Prioritylist[i+1]
                }
            }
        }
        if (gameselected === '') gameselected = userdata.settings.Prioritylist[0]
        userdata.game = gameselected
        winston.silly(" ")
        winston.info(chalk.gray('Selected ') + chalk.white(gameselected) + chalk.gray(' as next game from your Priority list... Watching in 45 seconds...'), {event: "newGame"})
        winston.silly(' ', {event: "progressEnd"})
        await delay(45000)
    }
}


