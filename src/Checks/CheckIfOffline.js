const data = require("../Data/SavedData");

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