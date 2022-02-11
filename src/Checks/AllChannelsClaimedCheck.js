const data = require("../Data/SavedData")

async function AllChannelsClaimedCheck() {
    let chsclaimed = 0;

    data.Streamers.forEach((element, index) => {
        if (element.claimed) {
            chsclaimed++
        }
    })
    return chsclaimed === data.Streamers.length
}

module.exports = {
    AllChannelsClaimedCheck
}