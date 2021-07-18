


//Progress
const {MapDrops} = require("../functions/MapDrops");
const {GetRustDrops} = require("../functions/GetRustDrops");
const data = require("../Data/SavedData");
const {ciEquals} = require("../functions/util");

async function CheckProgressCurrentPage(page, dropspage, startch, campaignpage) {

    await GetRustDrops(page, campaignpage, false);
    await MapDrops(dropspage)

    let name;

    data.Streamers.forEach((e, i) => {

        if (e.url === startch) name = e.twitch_name

        if (data.claimed.includes(e.twitch_name)) {
            e.claimed = true;
        }


    })

    for (let i = 0; i < data.dropsmap.length; i++)
    {
        if (ciEquals(data.dropsmap[i].url, startch)) {
            return data.dropsmap[i].percentage
        } else if (data.claimed.includes(name)) {
            return -1
        }


    }



}

module.exports = {
    CheckProgressCurrentPage
}

