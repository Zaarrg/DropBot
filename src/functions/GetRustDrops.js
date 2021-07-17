const data = require("../Data/SavedData");
const chalk = require("chalk");
const {statuscheck} = require("./util");


async function GetRustDrops(page, feedback) {
    await page.reload({
        waitUntil: ["networkidle2", "domcontentloaded"]
    })


    //Inject JQuery
    async function injectJQuery(page) {
        await page.addScriptTag({
            path: require.resolve("jquery")
        })
    }

    await injectJQuery(page);

    return await parseFacepunchStreamersPage(page).then(r => {
        data.Streamers = r;

        if (feedback) {
            data.Streamers.forEach((e, i) => {
                console.log(" ")
                console.log(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)+ " | " + statuscheck(e.live))
            })

        }

        return r;
    });


}

async function parseFacepunchStreamersPage(page) {

    return await page.evaluate(() => {
        let streamers = [];
        let GeneralDrops = [];

        //Get All Drops Add to Streamers
        const drops = $(".drops-group");
        drops.each((index, element) => {
            const elements = $(element).find("a.drop");
            elements.each((index, element) => {
                const $element = $(element);

                const url = $element.attr("href");
                const live = $element.hasClass("is-live");
                const streamerName = $element.find(".streamer-name").first().text();
                const dropName = $element.find(".drop-name").first().text();

                streamers.push({
                    url: url,
                    live: live,
                    name: streamerName.toString(),
                    drop: dropName.toString(),
                    claimed: false
                });
            });
        });


        //Get Drops which are General
        const GeneralDropsselector = $(".general-drops");
        GeneralDropsselector.each((index, element) => {
            const elements = $(element).find("a.drop");
            elements.each((index, element) => {
                const $element = $(element);

                const url = $element.attr("href");
                const live = $element.hasClass("is-live");
                const streamerName = $element.find(".streamer-name").first().text();
                const dropName = $element.find(".drop-name").first().text();

                GeneralDrops.push(url);
            });
        });

        //Filter General Drops out of Streamers
        streamers = streamers.filter(item => !GeneralDrops.includes(item.url))




        return streamers;
    })

}


module.exports = {
    GetRustDrops
}