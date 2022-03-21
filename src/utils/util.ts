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
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (pattern.test(str)) {
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

