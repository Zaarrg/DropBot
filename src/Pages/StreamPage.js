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


async function StreamPage(startch) {
    //Open New Tab to the Starting ch
    console.log(" ")
    console.log(chalk.gray("Going to Starting Channel..."))
    //Open Watching Tab
    const watchingpage = await data.browser.newPage();
    //Open Drops PAge tab
    const dropspage = await data.browser.newPage();
    //Open Drops campaign Page to get Drop name
    const campaignpage = await data.browser.newPage();
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
    await campaignpage.goto('https://www.twitch.tv/drops/campaigns', {waitUntil: ["domcontentloaded", "networkidle2"]});
    await campaignpage.waitForSelector(".section.streamer-drops, .section.general-drops, .section.is-getstarted"); // wait for one of the drop classes; default timeout is 30s
    
    //Check for 18+
    console.log(" ")
    console.log(chalk.gray("Setting Video Settings like Quality and Volume..."))
    //Set Settings
    await watchingpage.evaluate(() => {
        localStorage.setItem('mature', 'true')
        localStorage.setItem('video-muted', '{"default":false}')
        localStorage.setItem('volume', '0.5')
        localStorage.setItem('video-quality', '{"default":"160p30"}')
    })
    await watchingpage.setViewport({ width: 1280, height: 720 })
    await watchingpage.reload({
        waitUntil: ["networkidle2", "domcontentloaded"]
    })

    console.log(" ")
    console.log(chalk.magenta("Watching " + chalk.cyan(startch.toString() + "...") ))
    console.log(" ")

    //Start CurrentProgress Event
    await CurrentProgressEvent(dropspage, startch, watchingpage, campaignpage);

}




//CurrentProgressEvent
let retry = 0;

async function CurrentProgressEvent(dropspage, startch, watchingpage, campaignpage) {

    await delay(60000).then( async () => {

        await CheckProgressCurrentPage(data.page, dropspage, startch, campaignpage).then(async (PercentCurrentDrop) => {

            //console.log(PercentCurrentDrop)

            await CheckIfOffline(startch).then(async (CurrentChannelStatus) => {

                //console.log(CurrentChannelStatus)

                await CheckIfCurrentChannelsDropsOnHundred().then(async (CurrentChannelsAllHundred) => {

                    //console.log(CurrentChannelsAllHundred)

                    await SamePercentCheck(PercentCurrentDrop).then(async (SamePercentCheckResult) => {

                        //console.log(SamePercentCheckResult)

                       await CheckifAllClaimed().then(async (AllLiveClaimed) => {

                        if (SamePercentCheckResult) {
                            console.log(" ");
                            console.log(chalk.red("Percentage was same for at least 4 ticks... Looking for other channel..."));
                            if (data.choi <= 1) {
                                console.log(" ")
                                console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                await delay(600000);
                                await CheckForLiveChannels().then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            } else {
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }

                        }

                        if (AllLiveClaimed) {
                            console.log(" ");
                            console.log(chalk.cyan("All live Channels ") + chalk.green("claimed..."));
                            console.log(" ")
                            console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                            if (data.choi <= 1) {
                                await delay(600000);
                                await CheckForLiveChannels().then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            } else {
                                await delay(600000);
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }
                        }


                    if (CurrentChannelsAllHundred === false) {

                        if (CurrentChannelStatus === true) {

                            if (PercentCurrentDrop === undefined) {

                                retry++
                                if (retry < 3) {
                                    console.log(chalk.gray("Current Progress: ") + chalk.white("-" + " %") + chalk.gray(" | Try: ") + chalk.white(retry));
                                    await delay(90000).then(async () => {
                                        return await CurrentProgressEvent(dropspage, startch, watchingpage)
                                    })
                                } else if (retry === 3) {
                                    console.log(" ")
                                    console.log(chalk.red("Failed to find the drop under Active Drops in your twitch inventory or failed to recognize it under claimed Drops... Make Sure it appears there... Looking for a new one... "));
                                    retry = 0;
                                    if (data.choi.length <= 1) {
                                        console.log(" ")
                                        console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                        await delay(600000);
                                        retry = 0;
                                        await CheckForLiveChannels().then(async () => {
                                            dropspage.close();
                                            watchingpage.close();
                                            return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                        })
                                    } else {
                                        retry = 0;
                                        await CheckForLiveChannels(startch).then(async () => {
                                            dropspage.close();
                                            watchingpage.close();
                                            return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                        })
                                    }

                                }
                            } else if (PercentCurrentDrop < 100 && PercentCurrentDrop >= 0) {
                                retry = 0;
                                console.log(chalk.gray("Current Progress: ") + chalk.white(PercentCurrentDrop + " %") + chalk.gray(" | " + etacalc(PercentCurrentDrop)));
                                return await CurrentProgressEvent(dropspage, startch, watchingpage)
                            } else if (PercentCurrentDrop === 100) {
                                //100%
                                retry = 0;
                                console.log(" ")
                                console.log(chalk.cyan("Reached ") + chalk.green("100 %... ") + chalk.cyan("Looking for new Channel..."));
                                if (data.choi.length <= 1) {
                                    console.log(" ")
                                    console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                    await delay(600000);
                                    await CheckForLiveChannels().then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                } else {
                                    await CheckForLiveChannels(startch).then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                }

                            } else if (PercentCurrentDrop === -1) {
                                //Claimed
                                console.log(" ")
                                console.log(chalk.cyan("Drop already ") + chalk.green("claimed... ") + chalk.cyan("Looking for new Channel..."));
                                if (data.choi.length <= 1) {
                                    console.log(" ")
                                    console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                    await delay(600000);
                                    await CheckForLiveChannels().then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                } else {
                                    await CheckForLiveChannels(startch).then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                }

                            }
                        } else if (CurrentChannelStatus === false) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))

                            if (data.choi.length <= 1) {
                                console.log(" ")
                                console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                                await delay(600000);
                                await CheckForLiveChannels().then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            } else {
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }

                        }
                    } else if(CurrentChannelsAllHundred === true) {
                        console.log(" ")
                        console.log(chalk.cyan("Reached ") + chalk.green("100 % ") + chalk.cyan("on all currently Live Channels..."));
                        console.log(chalk.magenta("Waiting for new Channels to go Live... Retry in 10 Minutes "));
                        await delay(600000).then(async () => {
                            await CheckForLiveChannels(startch).then(async () => {
                                dropspage.close();
                                watchingpage.close();
                                return await StreamPage(data.choi[getRandomInt(data.choi.length)]);
                            })
                        })
                    }
                })
            })
                })
            })
        });
    }) //5
}





module.exports = {
    StreamPage
}


