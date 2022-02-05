const data = require("../Data/SavedData");

async function CheckifAllClaimed() {
    let alreadyclaimedandonline = 0;

    data.Streamers.forEach((e, i) => {

        if(data.choi.includes(e.url) && e.claimed) {
            alreadyclaimedandonline++
        }
    })
    return alreadyclaimedandonline === data.choi.length
}

module.exports = {
    CheckifAllClaimed
}