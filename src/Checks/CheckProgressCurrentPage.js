const {MapDrops} = require("../functions/MapDrops");
const {GetRustDrops} = require("../functions/GetRustDrops");
const data = require("../Data/SavedData");
const {ciEquals} = require("../functions/util");
const {Rustdrops_twitch} = require("../Data/SavedData");

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

    let progressarray = [];
    async function handleprogress() {
        for (let i = 0; i < data.dropsmap.length; i++)
        {
            if (data.alldropsgeneral) {
                data.Rustdrops_twitch.forEach(e => {
                    if (e.drop.toLowerCase() === data.dropsmap[i].name.toLowerCase()) {
                        progressarray.push({name: data.dropsmap[i].name, percentage: data.dropsmap[i].percentage})
                    }
                })
            } else if (data.claimed.includes(name)) {
                return -1
            } else if (ciEquals(data.dropsmap[i].url, startch)) {
                return data.dropsmap[i].percentage
            }
        }
        return progressarray;
    }
    return await handleprogress();
}

module.exports = {
    CheckProgressCurrentPage
}

