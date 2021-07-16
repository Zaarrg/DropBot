const {statuscheckboolean} = require("../functions/util");
const data = require("../Data/SavedData");
const chalk = require("chalk");
const {CheckForLiveChannels} = require("./CheckForLiveChannels");


async function CheckIfOffline(currentchlink) {
    //Check Drop 1
    if (data.Dropsamount >= 1) {
        if (currentchlink === data.Drop1.Name) {
            if (!statuscheckboolean(data.Drop1.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop2
    if (data.Dropsamount >= 2) {
        if (currentchlink === data.Drop2.Name) {
            if (!statuscheckboolean(data.Drop2.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop3
    if (data.Dropsamount >= 3) {
        if (currentchlink === data.Drop3.Name) {
            if (!statuscheckboolean(data.Drop3.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop4
    if (data.Dropsamount >= 4) {
        if (currentchlink === data.Drop4.Name) {
            if (!statuscheckboolean(data.Drop4.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop5
    if (data.Dropsamount >= 5) {
        if (currentchlink === data.Drop5.Name) {
            if (!statuscheckboolean(data.Drop5.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 6
    if (data.Dropsamount >= 6) {
        if (currentchlink === data.Drop6.Name) {
            if (!statuscheckboolean(data.Drop6.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 7
    if (data.Dropsamount >= 7) {
        if (currentchlink === data.Drop7.Name) {
            if (!statuscheckboolean(data.Drop7.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 8
    if (data.Dropsamount >= 8) {
        if (currentchlink === data.Drop8.Name) {
            if (!statuscheckboolean(data.Drop8.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 9
    if (data.Dropsamount >= 9) {
        if (currentchlink === data.Drop9.Name) {
            if (!statuscheckboolean(data.Drop9.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 10
    if (data.Dropsamount >= 10) {
        if (currentchlink === data.Drop10.Name) {
            if (!statuscheckboolean(data.Drop10.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 11
    if (data.Dropsamount >= 11) {
        if (currentchlink === data.Drop11.Name) {
            if (!statuscheckboolean(data.Drop11.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
    //Drop 12
    if (data.Dropsamount >= 12) {
        if (currentchlink === data.Drop12.Name) {
            if (!statuscheckboolean(data.Drop12.Status)) {
                console.log(" ")
                console.log(chalk.gray("Current Channel Offline looking for new one..."))
                return false
            } else {
                return true;
            }
        }
    }
}

module.exports = {
    CheckIfOffline
}