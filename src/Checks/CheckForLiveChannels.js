const data = require("../Data/SavedData")
const chalk = require("chalk");
const {delay} = require("../functions/util");
const {statuscheckboolean, ciEquals} = require("../functions/util")
const winston = require("winston");

let i = 0;
async function CheckForLiveChannels(removeurl) {
    data.choi = [];
    winston.info(" ")
    winston.info(chalk.gray("Checking for Live Channels"))

    data.Streamers.forEach((e, i) => {
        if (e.live) {
            data.choi.push(e.url)
        }
    })

    async function removewatching() {
        if (removeurl !== undefined) {
            for (let i = 0; i < data.choi.length; i++)
            {
                if (ciEquals(data.choi[i], removeurl)) {
                    return [data.choi.splice(i, 1), i--];

                }
            }
        }
    }
    await removewatching();

    async function removeclaimed() {
            let chstoremove = 0;
            const datachoibackup = [];
            data.choi.forEach(e => datachoibackup.push(e))

            for (let i = 0; i < data.choi.length; i++)
            {
                data.Streamers.forEach(e => {
                    if (data.choi[i] === e.url && e.claimed) {
                        chstoremove++
                        return [data.choi.splice(i, 1), i--];
                    }
                })
            } //Check if All Live Are Claimed if so dont remove them
            if (chstoremove === datachoibackup.length) {
                data.choi = datachoibackup
                winston.info(" ")
                winston.info(chalk.gray("All Live Channels Claimed..."))
                winston.info(" ")
            }
    }
    await removeclaimed();

    async function alloffline() {
        let a = 0;

        data.Streamers.forEach((e, i) => {
            if (!e.live) {
                a++
            }
        })

        if(a === data.Streamers.length) {
            data.Streamers.forEach((e, i) => {
                data.choi.push(e.url);
            })

            if (removeurl === undefined) {
                winston.info(" ")
                winston.info(chalk.magenta("All Channels Offline... Select any Channel to start..."))
            } else {
                winston.info(" ")
                winston.info(chalk.magenta("All Channels Offline..."))
                winston.info(" ")
                winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                await delay(600000)
            }
        }
    }
    await alloffline();
}

module.exports = {
    CheckForLiveChannels
}
