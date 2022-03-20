const chalk = require("chalk");
const {CheckForLiveChannels} = require("../Checks/CheckForLiveChannels");
const {CheckIfCurrentChannelsDropsOnHundred} = require("../Checks/CheckIfCurrentChannelsDropsOnHundred");
const {CheckIfOffline} = require("../Checks/CheckIfOffline");
const {CheckProgressCurrentPage} = require("../Checks/CheckProgressCurrentPage");
const {delay} = require("../functions/util");
const data = require("../Data/SavedData");
const {CheckifAllClaimed} = require("../Checks/CheckifAllClaimed");
const {SamePercentCheck} = require("../Checks/CheckIfSamePercent");
const {etacalc} = require("../functions/util");
const {getRandomInt} = require("../functions/util");
const winston = require("winston");
const {AllChannelsClaimedCheck} = require("../Checks/AllChannelsClaimedCheck");
const inputReader = require("wait-console-input");

async function StreamPage(startch) {
    //Open New Tab to the Starting ch
    winston.info(" ")
    winston.info(chalk.gray("Going to Starting Channel..."))
    if (data.debug) winston.info("DEBUG: Starting CH: " + startch + " Live Chs: %o", data.choi)
    //Open Watching Tab
    const watchingpage = await data.browser.newPage();
    await watchingpage.setDefaultTimeout(data.settings.timeout)
    //Open Drops PAge tab
    const dropspage = await data.browser.newPage();
    await dropspage.setDefaultTimeout(data.settings.timeout)
    //Open Drops campaign Page to get Drop name
    let campaignpage;
    if (data.Rustdrops_twitch === undefined) {
        campaignpage = await data.browser.newPage();
        await campaignpage.setDefaultTimeout(data.settings.timeout)
    }
    //Set Cookies
    await dropspage.setCookie.apply(dropspage, data.cookies);
    //Set Cookies
    await watchingpage.setCookie.apply(watchingpage, data.cookies);
    //Goto Selectetd Starting Ch
    await watchingpage.goto(startch)

    //Goto Twitch inv
    await dropspage.goto('https://www.twitch.tv/drops/inventory', {waitUntil: ["domcontentloaded", "networkidle2"]});
    await dropspage.waitForSelector("main.twilight-main > div.root-scrollable"); // default timeout is 30s

    //Got to campaignpage
    if (data.Rustdrops_twitch === undefined) {
        await campaignpage.setCookie.apply(campaignpage, data.cookies);
        await campaignpage.goto('https://www.twitch.tv/drops/campaigns', {waitUntil: ["domcontentloaded", "networkidle2"]});
        try {
            await campaignpage.waitForSelector(`h3[title="Rust"]`); // default timeout is 30s
        } catch (e) {
            winston.info(chalk.red(" Could not find any Rust Campaign on twitch... "))
            winston.info(' ')
            winston.error(e)
        }
    }
    //Check for 18+
    winston.info(" ")
    winston.info(chalk.gray("Setting Video Settings like Quality and Volume..."))
    //Set Settings
    await watchingpage.evaluate(() => {
        localStorage.setItem('mature', 'true')
        localStorage.setItem('video-muted', '{"default":false}')
        localStorage.setItem('volume', '0.5')
        localStorage.setItem('video-quality', '{"default":"160p30"}')
    })
    await watchingpage.setViewport({ width: 1280, height: 1080 })
    await watchingpage.reload({
        waitUntil: ["networkidle2", "domcontentloaded"]
    })
    await watchingpage.bringToFront();

    winston.info(" ")
    winston.info(chalk.magenta("Watching " + chalk.cyan(startch.toString() + "...") ))
    winston.info(" ")

    //Start CurrentProgress Event
    await CurrentProgressEvent(dropspage, startch, watchingpage, campaignpage);
}




//CurrentProgressEvent
let retry = 0;
async function CurrentProgressEvent(dropspage, startch, watchingpage, campaignpage) {
    await delay(data.settings.ProgressCheckInterval).then( async () => {
        if (data.debug) winston.info("DEBUG: Starting Checks...")
        await CheckProgressCurrentPage(data.page, dropspage, startch, campaignpage).then(async (PercentCurrentDrop) => {

            if (data.debug) {
                winston.info("DEBUG: Got the following data to work with: (Streamers)")
                data.Streamers.forEach((element) => winston.info('%o', element))
                winston.info(" Claimed Chs:")
                winston.info('%o', data.claimed)
                winston.info("  Live cHs:")
                winston.info('%o', data.choi)
                winston.info("  Drops Map:")
                winston.info('%o', data.dropsmap)
            }
            if (data.debug) winston.info("DEBUG: PercentCurrentDrop: " + PercentCurrentDrop)

            await CheckIfOffline(startch).then(async (CurrentChannelStatus) => {

                if (data.debug) winston.info("DEBUG: CurrentChannelStatus: " + CurrentChannelStatus)

                await CheckIfCurrentChannelsDropsOnHundred().then(async (CurrentChannelsAllHundred) => {

                    if (data.debug) winston.info("DEBUG: Are CurrentChannelsallclaimed/hundred: " + CurrentChannelsAllHundred)

                    await SamePercentCheck(PercentCurrentDrop).then(async (SamePercentCheckResult) => {

                        if (data.debug) winston.info("DEBUG: Is it the Same Percentage (SamePrecentCheck): " + SamePercentCheckResult)

                       await CheckifAllClaimed().then(async (AllLiveClaimed) => {
                           if (data.debug) winston.info("DEBUG: Are all live claimed: (Allliveclaimed): " + AllLiveClaimed)

                        if (SamePercentCheckResult) {
                            winston.info(" ");
                            winston.info(chalk.red("Percentage was same for at least 4 ticks... Looking for other channel..."));
                            if (data.choi.length <= 1) {
                                winston.info(" ")
                                winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                await delay(600000);
                                await CheckForLiveChannels().then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            } else {
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }
                        }
                        if (AllLiveClaimed) {
                            winston.info(" ");
                            winston.info(chalk.cyan("All live Channels ") + chalk.green("claimed..."));
                            winston.info(" ")
                            winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                            if (data.choi.length <= 1) {
                                await delay(600000);
                                await CheckForLiveChannels().then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            } else {
                                await delay(600000);
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }
                        }
                           await AllChannelsClaimedCheck().then(async (AllChannelsClaimed) => {
                               if (AllChannelsClaimed) {
                                   winston.info(" ");
                                   winston.info(chalk.cyan("All Channels ") + chalk.green("claimed..."));
                                   winston.info(" ")
                                   winston.error(chalk.magenta("Work is done here, going on vacation..."));
                                   if (!data.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                                   process.exit(31)
                               }
                           })
                    if (CurrentChannelsAllHundred === false) {
                        if (CurrentChannelStatus === true) {
                            if (PercentCurrentDrop === undefined) {
                                retry++
                                if (retry < 3) {
                                    winston.info(chalk.gray("Current Progress: ") + chalk.white("-" + " %") + chalk.gray(" | Try: ") + chalk.white(retry));
                                    await delay(90000).then(async () => {
                                        return await CurrentProgressEvent(dropspage, startch, watchingpage)
                                    })
                                } else if (retry === 3) {
                                    winston.info(" ")
                                    winston.info(chalk.red("Failed to find the drop under Active Drops in your twitch inventory or failed to recognize it under claimed Drops... Make Sure it appears there... Looking for a new one... "));
                                    retry = 0;
                                    if (data.choi.length <= 1) {
                                        winston.info(" ")
                                        winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                        await delay(600000);
                                        retry = 0;
                                        await CheckForLiveChannels().then(async () => {
                                            dropspage.close();
                                            watchingpage.close();
                                            if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                            return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                        })
                                    } else {
                                        retry = 0;
                                        await CheckForLiveChannels(startch).then(async () => {
                                            dropspage.close();
                                            watchingpage.close();
                                            if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                            return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                        })
                                    }
                                }
                            } else if (PercentCurrentDrop < 100 && PercentCurrentDrop >= 0) {
                                retry = 0;
                                winston.info(chalk.gray("Current Progress: ") + chalk.white(PercentCurrentDrop + " %") + chalk.gray(" | " + etacalc(PercentCurrentDrop)));
                                return await CurrentProgressEvent(dropspage, startch, watchingpage)
                            } else if (PercentCurrentDrop === 100) {
                                //100%
                                retry = 0;
                                winston.info(" ")
                                winston.info(chalk.cyan("Reached ") + chalk.green("100 %... ") + chalk.cyan("Looking for new Channel..."));
                                if (data.choi.length <= 1) {
                                    winston.info(" ")
                                    winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                    await delay(600000);
                                    await CheckForLiveChannels().then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                } else {
                                    await CheckForLiveChannels(startch).then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                }
                            } else if (PercentCurrentDrop === -1) {
                                //Claimed
                                winston.info(" ")
                                winston.info(chalk.cyan("Drop already ") + chalk.green("claimed... ") + chalk.cyan("Looking for new Channel..."));
                                if (data.choi.length <= 1) {
                                    winston.info(" ")
                                    winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                    await delay(600000);
                                    await CheckForLiveChannels().then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                } else {
                                    await CheckForLiveChannels(startch).then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                }
                            } else if (PercentCurrentDrop instanceof Array) {
                                if (data.debug) winston.info("General Drops Array in progress: %o", PercentCurrentDrop)
                                winston.info('\n')
                                PercentCurrentDrop.forEach(e => {
                                    winston.info(chalk.gray("Current Progress: ") + chalk.white(e.percentage + " %") + chalk.gray(" | Drop Name: ") + chalk.white(e.name) + chalk.gray(" | " + etacalc(e.percentage)));
                                })
                                return await CurrentProgressEvent(dropspage, startch, watchingpage)
                            }
                        } else if (CurrentChannelStatus === false) {
                            winston.info(" ")
                            winston.info(chalk.gray("Current Channel Offline looking for new one..."))

                            if (data.choi.length <= 1) {
                                winston.info(" ")
                                winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                await delay(600000);
                                await CheckForLiveChannels().then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            } else {
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }
                        }
                    } else if(CurrentChannelsAllHundred === true) {
                        winston.info(" ")
                        winston.info(chalk.cyan("Reached ") + chalk.green("100 % ") + chalk.cyan("on all currently Live Channels..."));
                        winston.info(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                        await delay(600000).then(async () => {
                            await CheckForLiveChannels(startch).then(async () => {
                                dropspage.close();
                                watchingpage.close();
                                if (data.debug) winston.info("Channels to randomly choose new one: %o", data.choi)
                                return await StreamPage(data.choi[getRandomInt(data.choi.length)]);
                            })
                        })
                    }
                })
            })
                })
            })
        });
    })
}

module.exports = {
    StreamPage
}


