import * as rax from "retry-axios";
import winston from "winston";
import {userdata} from "../index";

const chalk = require("chalk");
const fs = require("fs");

export function validPath(str: string) {
    if (fs.existsSync(str) && str.endsWith('.exe')) {
        return true
    } else {
        return "Please provide a Valid Path..."
    }
}

export function validURL(str: string) {
    if (str.startsWith("https://www.twitch.tv/")) {
        return true
    } else {
        return "Please provide a Valid URL..."
    }
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function statustoString(status: boolean) {
    if(!status) {
        return chalk.red("Offline")
    } else {
        return chalk.greenBright("Live")
    }
}

export function claimedstatustoString (streamer: boolean) {
    return (streamer) ? chalk.greenBright.italic('Claimed') : chalk.red.italic("Unclaimed")
}

export function livechresponse (foundlivechs: Array<string>) {
    if (foundlivechs.length >= 1) {
        return chalk.cyanBright(foundlivechs[0])
    } else if (foundlivechs.length === 0) {
        return chalk.cyan('No Channel Live')
    }
}

export function minutestoPercent(timewatched: number, maxtime: number) {
    let result = (100/maxtime)*timewatched
    let resultr = Math.round((result + Number.EPSILON) * 100) / 100;
    return resultr
}

export async function delay(ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

export let retryConfig = {
    retry: 3,
    noResponseRetries: 3,
    retryDelay: userdata.settings.RetryDelay,
    statusCodesToRetry: [[100, 199], [429, 429, 400], [500, 599]],
    httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT', 'POST'],
    onRetryAttempt: (err:any) => {
        const cfg = rax.getConfig(err);
        winston.info(chalk.yellow('Failed axios Request... Retrying in '+ Math.round(((cfg?.retryDelay)!/1000) * 100)/100 + ' seconds... Try: ' + cfg?.currentRetryAttempt + "/3 " + err), {event: "requestRetry"});
    },
    backoffType: 'static' as const
}
