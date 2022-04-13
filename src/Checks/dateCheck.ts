import winston from "winston";
import chalk from "chalk";
import {Drop} from "../functions/get/getCurrentDrop";
import {restartHandler} from "../functions/handler/restartHandler";



export async function dateCheck(CurrentDrop: Drop, onlymatch: boolean) {


    for (const [i, drop] of CurrentDrop.timebasedrop.entries()) {

        let currentDate = new Date().toISOString();
        let endDate = new Date(drop.endAt).toISOString();
        let startDate = new Date(drop.startAt).toISOString();

        let dropslenght = CurrentDrop.timebasedrop.length
        let noworkingamount = 0;


        if (currentDate >= endDate) {
            drop.self["status"] = 'Ended'
            noworkingamount++
        }
        if (currentDate <= startDate) {
            drop.self["status"] = 'Not Active'
            noworkingamount++
        }
        if (currentDate > startDate && currentDate < endDate) {
            drop.self["status"] = 'Active'
        }

        if (noworkingamount === dropslenght && !onlymatch) {
            winston.silly(" ")
            winston.info(chalk.yellow('All Drops are stopped or nonActive at the moment... Looking for new ones...'), {event: "newDrop"})
            await restartHandler(true, true, true, true, false)
        }

    }


}



