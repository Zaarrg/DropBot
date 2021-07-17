


//Progress
const {MapDrops} = require("../functions/MapDrops");
const {GetRustDrops} = require("../functions/GetRustDrops");
const data = require("../Data/SavedData");
const {ciEquals} = require("../functions/util");
const stringSimilarity = require("string-similarity");

async function CheckProgressCurrentPage(page, dropspage, startch) {

    await GetRustDrops(page, false);
    await MapDrops(dropspage)

    let name;

    data.Streamers.forEach((e, i) => {

        if (e.url === startch) {
            name = e.drop
        }

        try {
            if (stringSimilarity.findBestMatch(e.drop.toString(), data.claimed).bestMatch.rating >= 0.6) {
                e.claimed = true
            }
        } catch (e) {

        }



    })

    for (let i = 0; i < data.dropsmap.length; i++)
    {
        if (ciEquals(data.dropsmap[i].url, startch)) {
            return data.dropsmap[i].percentage
        } else if (stringSimilarity.findBestMatch(name, data.claimed).bestMatch.rating >= 0.6) {
            return -1
        }

    }

}

module.exports = {
    CheckProgressCurrentPage
}

