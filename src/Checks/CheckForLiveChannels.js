const data = require("../Data/SavedData")
const chalk = require("chalk");
const {statuscheckboolean, ciEquals} = require("../functions/util")


async function CheckForLiveChannels(removeurl) {
    data.choi = [];
    console.log(" ")
    console.log(chalk.gray("Checking for Live Channels"))

    if (statuscheckboolean(data.Drop1.Status)) {
        data.choi.push(data.Drop1.Name)
    }
    if (statuscheckboolean(data.Drop2.Status)) {
        data.choi.push(data.Drop2.Name)
    }
    if (statuscheckboolean(data.Drop3.Status)) {
        data.choi.push(data.Drop3.Name)
    }
    if (statuscheckboolean(data.Drop4.Status)) {
        data.choi.push(data.Drop4.Name)
    }
    if (statuscheckboolean(data.Drop5.Status)) {
        data.choi.push(data.Drop5.Name)
    }
    if (statuscheckboolean(data.Drop6.Status)) {
        data.choi.push(data.Drop6.Name)
    }
    if (statuscheckboolean(data.Drop7.Status)) {
        data.choi.push(data.Drop7.Name)
    }
    if (statuscheckboolean(data.Drop8.Status)) {
        data.choi.push(data.Drop8.Name)
    }
    if (statuscheckboolean(data.Drop9.Status)) {
        data.choi.push(data.Drop9.Name)
    }

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

}

module.exports = {
    CheckForLiveChannels
}
