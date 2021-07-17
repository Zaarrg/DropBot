const chalk = require("chalk");


function etacalc(a) {
    let result = 120-(120/100*a)
    let resultr = Math.round((result + Number.EPSILON) * 100) / 100;
    if (result === 1) {
        return chalk.gray(resultr + " Minute left")
    } else if (result <= 120) {
        return chalk.gray(resultr + " Minutes left")
    } else {
        return chalk.gray("-" + " Minutes left")
    }
}

function secondstominutescalc(a, b) {

    if (b === true) {
        let result = a/60;

        if (result === 1) {
            return chalk.gray(result + " Minute")
        } else {
            return chalk.gray(result + " Minutes")
        }
    } else {
        if (a === 1) {
            return chalk.gray(a + " Minute left")
        } else {
            return chalk.gray(a + " Minutes left")
        }
    }

}


function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function statuscheck(raw) {
    if(!raw) {
        return chalk.red("Offline")
    } else {
        return chalk.greenBright("Live")
    }
}

function statuscheckboolean(status) {
    if(status.includes("Offline")) {
        return false
    } else {
        return true
    }
}

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!!pattern.test(str)) {
        return true
    } else {
        return "Please provide a Valid URL..."
    }
}

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    etacalc,
    ciEquals,
    getRandomInt,
    statuscheck,
    statuscheckboolean,
    delay,
    validURL,
    secondstominutescalc
}