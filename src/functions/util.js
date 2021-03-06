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

function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function statuscheck(raw) {
    if(raw.includes("Offline")) {
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
    delay
}