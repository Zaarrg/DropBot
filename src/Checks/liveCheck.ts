import winston from "winston";
import chalk from "chalk";
import {restartHandler} from "../functions/handler/restartHandler";
import {delay} from "../utils/util";
import {userdata} from "../index" ;
import {customrestartHandler} from "../functions/handler/custompageHandler";

const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
export async function liveCheck(channelLogin: string, custom: boolean) {
    if (channelLogin !== undefined) {
        let status = await TwitchGQL.GetLiveStatus(channelLogin)
        if (!status) {
            winston.info(chalk.red('Current Channel offline... Looking for new one...'), {event: "offline"})
            if (custom) {
                await customrestartHandler(true)
            } else {
                await restartHandler(true, true, true, true, false)
            }
        }
    } else {
        winston.info(chalk.red('No Channel Live at the moment for this Drop... Looking for new one...'), {event: "offline"})
        if (custom) {
            await customrestartHandler(true)
        } else {
            await restartHandler(true, true, true, true, false)
        }
    }
}


export async function allOfflineCheck() {
    let dropsoffline = 0;
    userdata.drops.forEach(drop => {
            if (!drop.live) {
                dropsoffline++
            }
    })
    if (dropsoffline === userdata.drops.length) {
        if (userdata.settings.WaitforChannels && userdata.settings.Prioritylist.length === 0) {
            winston.silly(" ")
            winston.info(chalk.red('All Drops for this game are offline... Looking for new live Channels in 5 minutes...'), {event: "offline"})
            winston.silly(' ', {event: "progressEnd"})
            await delay(300000)
            await restartHandler(true, true, true, true, false)
        } else {
            winston.silly(" ")
            if (userdata.settings.Prioritylist.length === 0) winston.warn(chalk.yellow('Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings...'))
            winston.info(chalk.red('All Drops for this game are offline... Looking for new game...'), {event: "newGame"})
            await restartHandler(true, true, true, true, true)
        }

    }
}


export async function customallOfflineCheck() {
    let dropsoffline = 0;
    userdata.customchannel.forEach(drop => {
        if (!drop.live) {
            dropsoffline++
        }
    })
    if (dropsoffline === userdata.customchannel.length) {
            winston.silly(" ")
            winston.info(chalk.red('All Channels are offline... Looking for new live Channels in 5 minutes...'), {event: "offline"})
            winston.silly(' ', {event: "progressEnd"})
            await delay(300000)
            await customrestartHandler(true)
    }
}