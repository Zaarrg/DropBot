const data = require("../Data/SavedData")
const chalk = require("chalk");
const {statuscheckboolean, ciEquals} = require("../functions/util")

let i = 0;

async function CheckForLiveChannels(removeurl) {
    data.choi = [];
    console.log(" ")
    console.log(chalk.gray("Checking for Live Channels"))

    if (data.Dropsamount >= 1) {
        if (statuscheckboolean(data.Drop1.Status)) {
            data.choi.push(data.Drop1.Name)
        }
    }
    if (data.Dropsamount >= 2) {
        if (statuscheckboolean(data.Drop2.Status)) {
            data.choi.push(data.Drop2.Name)
        }
    }
    if (data.Dropsamount >= 3) {
        if (statuscheckboolean(data.Drop3.Status)) {
            data.choi.push(data.Drop3.Name)
        }
    }
    if (data.Dropsamount >= 4) {
        if (statuscheckboolean(data.Drop4.Status)) {
            data.choi.push(data.Drop4.Name)
        }
    }
    if (data.Dropsamount >= 5) {
        if (statuscheckboolean(data.Drop5.Status)) {
            data.choi.push(data.Drop5.Name)
        }
    }
    if (data.Dropsamount >= 6) {
        if (statuscheckboolean(data.Drop6.Status)) {
            data.choi.push(data.Drop6.Name)
        }
    }
    if (data.Dropsamount >= 7) {
        if (statuscheckboolean(data.Drop7.Status)) {
            data.choi.push(data.Drop7.Name)
        }
    }
    if (data.Dropsamount >= 8) {
        if (statuscheckboolean(data.Drop8.Status)) {
            data.choi.push(data.Drop8.Name)
        }
    }
    if (data.Dropsamount >= 9) {
        if (statuscheckboolean(data.Drop9.Status)) {
            data.choi.push(data.Drop9.Name)
        }
    }
    if (data.Dropsamount >= 10) {
        if (statuscheckboolean(data.Drop10.Status)) {
            data.choi.push(data.Drop10.Name)
        }
    }
    if (data.Dropsamount >= 11) {
        if (statuscheckboolean(data.Drop11.Status)) {
            data.choi.push(data.Drop11.Name)
        }
    }
    if (data.Dropsamount >= 12) {
        if (statuscheckboolean(data.Drop12.Status)) {
            data.choi.push(data.Drop12.Name)
        }
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

    async function alloffline() {
            if (ciEquals(data.Drop1.Status, "Offline") && ciEquals(data.Drop2.Status, "Offline") && ciEquals(data.Drop3.Status, "Offline") && ciEquals(data.Drop4.Status, "Offline") && ciEquals(data.Drop5.Status, "Offline") && ciEquals(data.Drop6.Status, "Offline") && ciEquals(data.Drop7.Status, "Offline") && ciEquals(data.Drop8.Status, "Offline") ) {
                data.choi = [];
                if (data.Dropsamount >= 1) {
                    data.choi.push(data.Drop1.Name)
                }
                if (data.Dropsamount >= 2) {
                    data.choi.push(data.Drop2.Name)
                }
                if (data.Dropsamount >= 3) {
                    data.choi.push(data.Drop3.Name)
                }
                if (data.Dropsamount >= 4) {
                    data.choi.push(data.Drop4.Name)
                }
                if (data.Dropsamount >= 5) {
                    data.choi.push(data.Drop5.Name)
                }
                if (data.Dropsamount >= 6) {
                    data.choi.push(data.Drop6.Name)
                }
                if (data.Dropsamount >= 7) {
                    data.choi.push(data.Drop7.Name)
                }
                if (data.Dropsamount >= 8) {
                    data.choi.push(data.Drop8.Name)
                }
                if (data.Dropsamount >= 9) {
                    data.choi.push(data.Drop9.Name)
                }
                if (data.Dropsamount >= 10) {
                    data.choi.push(data.Drop10.Name)
                }
                if (data.Dropsamount >= 11) {
                    data.choi.push(data.Drop11.Name)
                }
                if (data.Dropsamount >= 12) {
                    data.choi.push(data.Drop12.Name)
                }
                if (i === 0) {
                    console.log(" ")
                    console.log(chalk.magenta("All Channels Offline... Select any Channel to start..."))
                    i++
                }
            }
    }

    await alloffline();


}

module.exports = {
    CheckForLiveChannels
}
