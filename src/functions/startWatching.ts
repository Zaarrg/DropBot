import winston from "winston";
import chalk from "chalk";
import {userdata} from "../index" ;
import {WatchingEventHandlerStart} from "./handler/watchpageHandler";

export async function startWatching() {
    let channelLogin:string = ''
    for await (const Drops of userdata.drops) {
        if (Drops.dropname === userdata.startDrop) {
            channelLogin = Drops.foundlivech[0]
        }
    }

    winston.silly(" ")
    winston.info(chalk.gray('Starting to watch..'), {event: "progress"})

    //Start WatchingEventHandler
    await WatchingEventHandlerStart(channelLogin)
}