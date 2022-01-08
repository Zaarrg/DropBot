const data = require("../Data/SavedData");
const chalk = require("chalk");
const {statuscheck} = require("./util");

async function GetRustDrops(page, campaignpage, feedback ) {
    await page.reload({
        waitUntil: ["networkidle2", "domcontentloaded"]
    })


    //Inject JQuery
    async function injectJQuery(page, campaignpage) {
        await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.6.0.js'})
        if (campaignpage !== undefined) {
            await campaignpage.addScriptTag({url: 'https://code.jquery.com/jquery-3.6.0.js'})
        }
    }

    await injectJQuery(page, campaignpage);

    return await parseFacepunchStreamersPage(page).then(async (streamers) => {
        data.Streamers = streamers;

        if (campaignpage !== undefined) {
            return await parseRustcampaignpage(campaignpage).then(alltwitchdrops => {

                data.Streamers.forEach((element, index) => {

                    alltwitchdrops.forEach((e, i) => {

                        if (element.url === e.url) {
                            element.twitch_name = e.drop
                        }

                    })

                })

                if (feedback) {
                    data.Streamers.forEach((e, i) => {
                        console.log(" ")
                        console.log(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)+ " | " + statuscheck(e.live))
                    })

                }

                return streamers;

            })

        } else if (data.Rustdrops_twitch !== undefined) {

            data.Streamers.forEach((element, index) => {

                data.Rustdrops_twitch.forEach((e, i) => {

                    if (element.url === e.url) {
                        element.twitch_name = e.drop
                    }

                })

            })

            if (feedback) {
                data.Streamers.forEach((e, i) => {
                    console.log(" ")
                    console.log(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)+ " | " + statuscheck(e.live))
                })

            }

            return streamers;



        } else {

            if (feedback) {
                data.Streamers.forEach((e, i) => {
                    console.log(" ")
                    console.log(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)+ " | " + statuscheck(e.live))
                })

            }

            return streamers;

        }




    });


}

async function parseFacepunchStreamersPage(page) {

    return await page.evaluate(() => {
        let streamers = [];
        let GeneralDrops = [];

        //Get All Drops Add to Streamers
        const drops = $(".drops-group");
        drops.each((index, element) => {
            const elements = $(element).find("a.drop-tile");
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
                    twitch_name: " ",
                    claimed: false
                });
            });
        });


        //Get Drops which are General
        const GeneralDropsselector = $(".general-drops");
        GeneralDropsselector.each((index, element) => {
            const elements = $(element).find("a.drop-tile");
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

async function parseRustcampaignpage(campaignpage) {

        const rustDrops_twitch = await campaignpage.evaluate(() => {
            let DropDivs = [];
            let twitchrustdrops = [];

            //Get the Rust Campaign
            let Campaign = $('[alt="Rust"]').parents()[6]

            //Get Every Drop div
            let DropdivsHeaders = $(Campaign).find("p:contains('Rust')")

            //Push Every Dropdiv element to an Array
            DropdivsHeaders.each((index, element) => {
                DropDivs.push($(element).parents()[2])
            })

            //Get name and url of the Drop element and push it
            DropDivs.forEach((element, index) => {
                const name = $(element).find('.tw-image').first().attr('alt');
                const link = $(element).find('.tw-link:not([href^="/directory"])').attr('href')

                twitchrustdrops.push({drop: name, url: "https://www.twitch.tv" + link})
            })

            return twitchrustdrops
        })
        if(data.debug) console.log("DEBUG: GOT RUST Campaing")
        data.Rustdrops_twitch = rustDrops_twitch;
        campaignpage.close();
        return data.Rustdrops_twitch

}


module.exports = {
    GetRustDrops
}