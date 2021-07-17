const data = require("../Data/SavedData")
const chalk = require("chalk");
const {delay} = require("../functions/util");
const {statuscheckboolean, ciEquals} = require("../functions/util")

let i = 0;

async function CheckForLiveChannels(removeurl) {
    data.choi = [];
    console.log(" ")
    console.log(chalk.gray("Checking for Live Channels"))

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
                console.log(" ")
                console.log(chalk.magenta("All Channels Offline... Select any Channel to start..."))
            } else {
                console.log(" ")
                console.log(chalk.magenta("All Channels Offline..."))
                console.log(" ")
                console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                await delay(600000)
            }


        }


    }

    await alloffline();


}

module.exports = {
    CheckForLiveChannels
}
