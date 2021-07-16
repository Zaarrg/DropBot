const chalk = require("chalk");
const {CheckForLiveChannels} = require("../Checks/CheckForLiveChannels");
const {CheckIfCurrentChannelsDropsOnHundred} = require("../Checks/CheckIfCurrentChannelsDropsOnHundred");
const {CheckIfOffline} = require("../Checks/CheckIfOffline");
const {CheckProgressCurrentPage} = require("../Checks/CheckProgressCurrentPage");
const {delay} = require("../functions/util");
const data = require("../Data/SavedData");
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
    //Set Cookies
    await dropspage.setCookie.apply(dropspage, data.cookies);
    //Set Cookies
    await watchingpage.setCookie.apply(watchingpage, data.cookies);
    //Goto Selectetd Starting Ch
    await watchingpage.goto(startch)
    //Goto Twitch inv
    await dropspage.goto('https://www.twitch.tv/drops/inventory', {waitUntil: "networkidle2"})
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
    await CurrentProgressEvent(dropspage, startch, watchingpage);

}





//CurrentProgressEvent
let retry = 0;

async function CurrentProgressEvent(dropspage, startch, watchingpage) {

    await delay(60000).then( async () => {

        await CheckProgressCurrentPage(data.page, dropspage, startch).then(async (PercentCurrentDrop) => {

            await CheckIfOffline(startch).then(async (CurrentChannelStatus) => {

                await CheckIfCurrentChannelsDropsOnHundred().then(async (CurrentChannelsAllHundred) => {

                    await SamePercentCheck(PercentCurrentDrop).then(async (SamePercentCheckResult) => {

                        if (SamePercentCheckResult) {
                            console.log(" ");
                            console.log(chalk.red("Percentage was same for atleast 4 ticks... Looking for other channel..."));
                            await CheckForLiveChannels(startch).then(async () => {
                                dropspage.close();
                                watchingpage.close();
                                return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                            })
                        }

                    if (CurrentChannelsAllHundred === false) {

                        if (CurrentChannelStatus === true) {

                            if (PercentCurrentDrop === undefined) {

                                retry++
                                if (retry < 3) {
                                    console.log(chalk.gray("Current Progress: ") + chalk.white("-" + " %") + chalk.gray(" | Try: ") + chalk.white(retry));
                                    await delay(240000).then(async () => {
                                        return await CurrentProgressEvent(dropspage, startch, watchingpage)
                                    })
                                } else if (retry === 3) {
                                    console.log(" ")
                                    console.log(chalk.red("Failed to get a valid Drop to progress on this Channel or it is already claimed... Looking for a new one... "));
                                    retry = 0;
                                    await CheckForLiveChannels(startch).then(async () => {
                                        dropspage.close();
                                        watchingpage.close();
                                        return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                    })
                                }
                            } else if (PercentCurrentDrop < 100) {
                                retry = 0;
                                console.log(chalk.gray("Current Progress: ") + chalk.white(PercentCurrentDrop + " %") + chalk.gray(" | " + etacalc(PercentCurrentDrop)));
                                return await CurrentProgressEvent(dropspage, startch, watchingpage)
                            } else if (PercentCurrentDrop === 100) {
                                //100%
                                retry = 0;
                                console.log(" ")
                                console.log(chalk.cyan("Reached ") + chalk.green("100 %... ") + chalk.cyan("Looking for new Channel..."));
                                await CheckForLiveChannels(startch).then(async () => {
                                    dropspage.close();
                                    watchingpage.close();
                                    return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                                })
                            }
                        } else if (CurrentChannelStatus === false) {
                            await CheckForLiveChannels(startch).then(async () => {
                                dropspage.close();
                                watchingpage.close();
                                return await StreamPage(data.choi[getRandomInt(data.choi.length)])
                            })
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
        });
    }) //5
}





module.exports = {
    StreamPage
}


