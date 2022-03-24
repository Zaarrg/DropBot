import {WatchingEventHandlerStop} from "./watchpageHandler";
import {askWhatDropToStart, askWhatGameToWatch, getTwitchDrops} from "../get/getTwitchDrops";
import {startWatching} from "../startWatching";
import {userdata} from "../../data/userdata";
import winston from "winston";
import chalk from "chalk";
import {delay} from "../../utils/util";

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
    winston.info(' ')
    winston.info(chalk.gray('Selected ') + chalk.white(gameselected) + chalk.gray(' as next game from your Priority list... Watching in 45 seconds...'))
    await delay(45000)
}