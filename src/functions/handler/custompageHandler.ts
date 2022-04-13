import {CustomChannel} from "../../Data/userdata";
import {userdata} from "../../index";
import {customallOfflineCheck, liveCheck} from "../../Checks/liveCheck";
import {sendMinuteWatched} from "./watchpageHandler"
import {pointsCheck} from "../../Checks/pointsCheck";
import {delay} from "../../utils/util";
import winston from "winston";
import chalk from "chalk";
import {askCustomChannelStart, customCheckLive} from "../get/getCustomChannel";

let status:string = 'stopped';

export async function CustomEventHandlerStart(DropcurrentlyWatching: string) {
    if (status === 'stopped') {
        await customallOfflineCheck();
        await liveCheck(DropcurrentlyWatching, true);
        await pointsCheck(DropcurrentlyWatching);
        await sendMinuteWatched(DropcurrentlyWatching.toString().toLowerCase())
        status = 'running'
        await customloop(DropcurrentlyWatching);
    } else if (status === 'running') {
        await customloop(DropcurrentlyWatching);
    }
}

let watchedtime = 0;
async function customloop(channelLogin: string) {
    await delay(userdata.settings.ProgressCheckInterval);
    watchedtime = (watchedtime + userdata.settings.ProgressCheckInterval)

    //find right custom drop
    await getCustomDrop(channelLogin).then(async (currentdrop) => {
        await customCheckLive(false);
        await customallOfflineCheck();
        await liveCheck(channelLogin, true);
        let neededtimeinms = (currentdrop.Time * 60000)
        if (status === 'running') {
            if (currentdrop.WatchType === "Watch until time runs out") {
                if (watchedtime < neededtimeinms) {
                    await pointsCheck(channelLogin).then(async points => {
                        await sendMinuteWatched(channelLogin.toString().toLowerCase())
                        winston.info(chalk.gray("Watching since: ") + chalk.white((Number(watchedtime / 60000).toFixed(2))) + chalk.gray(" | Minutes Left: " + chalk.white((neededtimeinms - watchedtime) / 60000)) + chalk.gray(" | Points: ") + chalk.white(points.toString()), {event: "progress"});
                        winston.silly('', {event: "progressEnd"})
                        await customloop(channelLogin)
                    });

                } else if (watchedtime >= neededtimeinms) {
                    status = 'stopped'
                    winston.info(chalk.green('Finished watching the channel: ' + channelLogin), {event: "newDrop"})
                    winston.info(chalk.gray('Looking for a new Channel...'), {event: "newDrop"})
                    await customrestartHandler(true)
                }
            } else {
                await pointsCheck(channelLogin).then(async points => {
                    await sendMinuteWatched(channelLogin.toString().toLowerCase())
                    winston.info(chalk.gray("Watching since: ") + chalk.white((Number(watchedtime / 60000).toFixed(2))) + chalk.gray(" | Points: ") + chalk.white(points.toString()), {event: "progress"});
                    winston.silly('', {event: "progressEnd"})
                    await customloop(channelLogin)
                });
            }
        }
    })
}

export async function customrestartHandler(random: boolean) {
    watchedtime = 0;
    await customCheckLive(false);
    await askCustomChannelStart(random, true);
    await CustomEventHandlerStart(userdata.startDrop);
}

async function getCustomDrop(ChannelLogin: string) {
    let currentdrop:CustomChannel = {
        Name: '',
        TTVLink: '',
        WatchType: '',
        Time: 0,
        Points: false,
        live: false
    };
    userdata.customchannel.forEach(drop => {
        if (drop.TTVLink === 'https://www.twitch.tv/' + ChannelLogin) {
            currentdrop = drop;
        }
    })
    return currentdrop;
}