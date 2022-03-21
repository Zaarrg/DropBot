import winston from "winston";
import chalk from "chalk";
import {userdata} from "../data/userdata";
import {WatchingEventHandlerStart} from "./handler/watchpageHandler";

export async function startWatching() {
    let channelLogin:string = ''
    for (const Drops of userdata.drops) {
        if (Drops.dropname === userdata.startDrop) {
            channelLogin = Drops.foundlivech[0]
        }
    }

    winston.info(' ')
    winston.info(chalk.gray('Starting to watch..'))

    //Start WatchingEventHandler
    await WatchingEventHandlerStart(channelLogin)

}