const data = require("../Data/SavedData");
const chalk = require("chalk");
const {statuscheck} = require("./util");
const winston = require("winston");
const similarity = require('similarity')

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
    return await parseFacepunchStreamersPage(page).then(async (StreamersAndBoolean) => {
        if (StreamersAndBoolean[1] === true) {data.alldropsgeneral = true}
        let streamers = StreamersAndBoolean[0]
        data.Streamers = streamers;
        if (campaignpage !== undefined) {
            return await parseRustcampaignpage(campaignpage).then(alltwitchdrops => {
                //Try guessing generic drops to map correct twitch name (only if all drops are general)
                if (data.alldropsgeneral) {
                    let genericdrops;
                    alltwitchdrops.forEach(e => {if (e.Streamername.toLowerCase() === 'generic') {genericdrops = e.drop.split(',')}})
                    genericdrops.forEach(genericelement => {
                        streamers.forEach(e => {
                            let namestring = e.name + " " + e.drop
                            if(similarity(namestring, genericelement)  >= 0.66) {
                                e.twitch_name = genericelement;
                            }
                        })
                    })
                }
                data.Streamers.forEach((element, index) => {
                    alltwitchdrops.forEach((e, i) => {
                        let namestring = element.name + " " + element.drop
                        if (!data.alldropsgeneral && element.url.toLowerCase() === e.url.toLowerCase()) {
                            element.twitch_name = e.drop
                        } else if (element.name.toLowerCase().replace(" ", "") === e.Streamername.toLowerCase().replace(" ", "") || similarity(namestring, e.drop) >= 0.66) {
                            element.twitch_name = e.drop
                        }
                    })
                })
                data.Streamers.forEach((e, i) => {
                    if (data.claimed.includes(e.twitch_name)) {
                        e.claimed = true;
                    }
                })
                function claimedstatustostring (streamer) {return (streamer.claimed) ? chalk.greenBright.italic('Claimed') : chalk.red.italic("Unclaimed")}
                if (feedback) {
                    data.Streamers.forEach((e, i) => {
                        winston.info(" ")
                        winston.info(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)  + " | " + statuscheck(e.live) + ' | ' + claimedstatustostring(e) )
                    })
                }
                return streamers;
            })
        } else if (data.Rustdrops_twitch !== undefined) {
            //Try guessing generic drops to map correct twitch name (only if all drops are general)
            if (data.alldropsgeneral) {
                let genericdrops;
                data.Rustdrops_twitch.forEach(e => {if (e.Streamername.toLowerCase() === 'generic') {genericdrops = e.drop.split(',')}})
                genericdrops.forEach(genericelement => {
                    streamers.forEach(e => {
                        let namestring = e.name + " " + e.drop
                        if(similarity(namestring, genericelement)  >= 0.66) {
                            e.twitch_name = genericelement;
                        }
                    })
                })
            }
            data.Streamers.forEach((element, index) => {
                data.Rustdrops_twitch.forEach((e, i) => {
                    let namestring = element.name + " " + element.drop
                    if (!data.alldropsgeneral && element.url.toLowerCase() === e.url.toLowerCase()) {
                        element.twitch_name = e.drop
                    } else if (element.name.toLowerCase().replace(" ", "") === e.Streamername.toLowerCase().replace(" ", "") || similarity(namestring, e.drop) >= 0.66) {
                        element.twitch_name = e.drop
                    }
                })
            })
            data.Streamers.forEach((e, i) => {
                if (data.claimed.includes(e.twitch_name)) {
                    e.claimed = true;
                }
            })
            if (feedback) {
                data.Streamers.forEach((e, i) => {
                    winston.info(" ")
                    winston.info(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)+ " | " + statuscheck(e.live))
                })
            }
            return streamers;
        } else {
            if (feedback) {
                data.Streamers.forEach((e, i) => {
                    winston.info(" ")
                    winston.info(chalk.cyan(e.url) + " | " + chalk.magenta(e.drop)+ " | " + statuscheck(e.live))
                })
            }
            return streamers;
        }
    });
}

async function parseFacepunchStreamersPage(page) {
    if (data.debug) winston.info(chalk.gray("Waiting for FacepunchStreamersSite to load (WaitForSelector)"));
    let elementexists = await page.evaluate(() => {let el = document.querySelector('.drops-group'); return el ? el.innerText : ""})
    if (elementexists !== "") {
        try {await page.waitForSelector('.drops-group', {visible: true});} catch (e) {winston.info(chalk.yellow('WARNING: Facepunch Streamers not loaded...'))}
    }
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
                const streamerName = $element.find(".streamer-name").first().text().replace(/^\s+|\s+$|\s+(?=\s)/g, "");
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
        const GeneralDropsselector = $(".drops-group").last();
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
        let alldropsgeneral = false;
        if ($(".drops-group").length !== 1) {
            streamers = streamers.filter(item => !GeneralDrops.includes(item.url))
        } else {alldropsgeneral = true}
        return [streamers, alldropsgeneral];
    })
}

async function parseRustcampaignpage(campaignpage) {
    if (data.debug) winston.info(chalk.gray("Waiting for Campaignpage to load (WaitForSelector)"));
    let elementexists = await campaignpage.evaluate(() => {let el = document.querySelector('[alt="Rust"]'); return el ? el.innerText : ""})
    if (elementexists !== "") {
        try {await campaignpage.waitForSelector('[alt="Rust"]', {visible: true});} catch (e) {winston.info(chalk.yellow('WARNING: Rust Campaign page not loaded..'))}
    }
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
                let dropname = $(element).find('.tw-image').first().attr('alt');
                if ($(element).find('.tw-image').length > 1) {
                    let array = [];
                    $(element).find('.tw-image').each((index, element) => array.push($(element).attr('alt')));
                    dropname = array.toString();
                }
                let link = $(element).find('.tw-link:not([href^="/directory"])').attr('href')
                const streamername = $(element).find("p:contains('Rust')").text().split('-').slice(-1)[0].replace(" ", "")
                twitchrustdrops.push({drop: dropname, url: "https://www.twitch.tv" + link, Streamername: streamername})
            })
            return twitchrustdrops
        })
        if(data.debug) winston.info("DEBUG: GOT RUST Campaing \n %o", rustDrops_twitch)
        data.Rustdrops_twitch = rustDrops_twitch;
        campaignpage.close();
        return data.Rustdrops_twitch
}


module.exports = {
    GetRustDrops
}