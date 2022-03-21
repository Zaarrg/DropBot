import winston from "winston";
import chalk from "chalk";
import {restartHandler} from "../functions/handler/restartHandler";
import {delay} from "../utils/util";
import {userdata} from "../data/userdata";
import {customrestartHandler} from "../functions/handler/custompageHandler";

const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
export async function liveCheck(channelLogin: string, custom: boolean) {
    if (channelLogin !== undefined) {
        let status = await TwitchGQL.GetLiveStatus(channelLogin)
        if (!status) {
            winston.info(chalk.red('Current Channel offline... Looking for new one...'))
            if (custom) {
                await customrestartHandler(true)
            } else {
                await restartHandler(true, true, true, true, false)
            }
        }
    } else {
        winston.info(chalk.red('No Channel Live at the moment for this Drop... Looking for new one...'))
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
        if (userdata.settings.WaitforOnlineChannels && userdata.settings.Prioritylist.length === 0) {
            winston.info(' ')
            winston.info(chalk.red('All Drops for this game are offline... Looking for new live Channels in 5 minutes...'))
            await delay(300000)
            await restartHandler(true, true, true, true, false)
        } else {
            winston.info(' ')
            winston.info(chalk.red('All Drops for this game are offline... Looking for new game...'))
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
            winston.info(' ')
            winston.info(chalk.red('All Channels are offline... Looking for new live Channels in 5 minutes...'))
            await delay(300000)
            await customrestartHandler(true)
    }
}