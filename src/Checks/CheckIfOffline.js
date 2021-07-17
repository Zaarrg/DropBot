const {statuscheckboolean} = require("../functions/util");
const data = require("../Data/SavedData");
const chalk = require("chalk");
const {CheckForLiveChannels} = require("./CheckForLiveChannels");


async function CheckIfOffline(currentchlink) {
    let status;


    data.Streamers.forEach((element, index) => {

        if (currentchlink === element.url) {
            status = element.live
        }

    })

    return status;



}

module.exports = {
    CheckIfOffline
}