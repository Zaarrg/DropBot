


//Progress
const {MapDrops} = require("../functions/MapDrops");
const {GetRustDrops} = require("../functions/GetRustDrops");
const data = require("../Data/SavedData");
const {ciEquals} = require("../functions/util");

async function CheckProgressCurrentPage(page, dropspage, startch) {

    await GetRustDrops(page, false);
    await MapDrops(dropspage)

    for (let i = 0; i < data.dropsmap.length; i++)
    {
        if (ciEquals(data.dropsmap[i].tvlink, startch)) {
            return data.dropsmap[i].percent
        }
    }

}

module.exports = {
    CheckProgressCurrentPage
}

