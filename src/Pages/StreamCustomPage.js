const chalk = require("chalk");
const {delay} = require("../functions/util");
const data = require("../Data/SavedData");
const inputReader = require("wait-console-input");
const {secondstominutescalc} = require("../functions/util");
const {checkstatus} = require("../functions/CustomChannel");

let watchingpage;

async function StreamCustomPage(startch) {

    let starturl;
    let time;
    let WatchType;
    t = 0;

    data.CustomChannels.forEach(item => {
        if (item.Name === startch) {
            starturl = item.TTVLink;
            time = item.Time;
            WatchType = item.WatchType;
        } else if (item.TTVLink === startch) {
            starturl = item.TTVLink;
            time = item.Time;
            WatchType = item.WatchType;
        }
    })

    if (starturl === undefined) {
        console.log(" ")
        console.log(chalk.red("Did not found this Channel exiting..."))
        console.log(" ")
        inputReader.wait(chalk.gray("Press any Key to continue..."))
        process.exit(51)
    }


    //Open New Tab to the Starting ch
    console.log(" ")
    console.log(chalk.gray("Going to Starting Channel..."))
    //Open Watching Tab
    watchingpage = await data.browser.newPage();
    //Set Cookies
    await watchingpage.setCookie.apply(watchingpage, data.cookies);
    //Goto Selectetd Starting Ch
    await watchingpage.goto(starturl)
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
    console.log(chalk.magenta("Watching " + chalk.cyan(starturl.toString() + "...") ))
    console.log(" ")

    //Start CurrentProgress Event
    await CurrentProgressEvent(WatchType, time, starturl);

}

//CurrentProgressEvent
let retry = 0;
let timeinseconds = 0;
let t = 0;

async function CurrentProgressEvent(WatchType, time, starturl) {

    await delay(60000).then(async () => {

        await checkstatus(false, false).then(async r => {

            let currenturlstatus = "";
            let onlinechs = [];
            let offlinechs = [];
            let pointi;

            r.forEach(item => {
                if (item.TTVLink === starturl) {
                    currenturlstatus = item.Status;
                }

                if (item.Status === "Online") {

                    if (item.TTVLink !==  starturl) {
                        onlinechs.push(item.TTVLink);
                    }

                } else {
                    offlinechs.push(item.TTVLink);
                }

            })

            data.CustomChannels.forEach(r => {
                if (r.TTVLink === starturl) {
                    pointi = r.Points;
                }
            })


            await farmpoint().then(async points => {

                if (currenturlstatus === "Online") {

                    if (WatchType === "Changed") {
                        timeinseconds = timeinseconds + 60;
                        console.log(chalk.gray("Current Progress: ") + chalk.white("-" + " %") + chalk.gray(" | Watching since: " + secondstominutescalc(timeinseconds, true)) + await pointscheck(points.Points, points.Bonus, pointi));
                        return await CurrentProgressEvent(WatchType, time, starturl)
                    } else {
                        let timeleftinminutes = time;
                        let timeleft = timeleftinminutes - 1;

                        if (timeleftinminutes > 0) {
                            console.log(chalk.gray("Current Progress: ") + chalk.white("-" + " %") + chalk.gray(" | " + secondstominutescalc(timeleftinminutes, false)) + await pointscheck(points.Points, points.Bonus, pointi));
                            return await CurrentProgressEvent(WatchType, timeleft, starturl)
                        } else {

                            if (t === 0) {
                                console.log(" ");
                                console.log(chalk.gray("Finished Watching Custom Channel looking for new Custom Channel..."));
                                t++
                            }


                            if (onlinechs.length === 0) {
                                console.log(" ");
                                console.log(chalk.gray("No other Online Custom Channels found waiting for new Channels to go Online..."));

                                await delay(540000).then(async () => {
                                    return CurrentProgressEvent(WatchType, time, starturl)
                                })


                            } else {
                                console.log(" ");
                                console.log(chalk.gray("Found other Channel..."));

                                const randomurl = onlinechs[Math.floor(Math.random() * onlinechs.length)];

                                console.log(" ");
                                console.log(chalk.magenta("Starting to Watch " + chalk.cyan(randomurl.toString() + "...")));

                                return StreamCustomPage(randomurl.toString());


                            }



                        }


                    }



                } else {
                    console.log(" ");
                    console.log(chalk.gray("Current Channel is Offline, looking for new one..."));

                    if (onlinechs.length === 0) {
                        console.log(" ");
                        console.log(chalk.gray("No other Online Custom Channels found waiting for new Channels to go Online..."));

                        await delay(540000).then(async () => {
                            return CurrentProgressEvent(WatchType, time, starturl)
                        })


                    } else {
                        console.log(" ");
                        console.log(chalk.gray("Found other Channel..."));

                        const randomurl = onlinechs[Math.floor(Math.random() * onlinechs.length)];

                        console.log(" ");
                        console.log(chalk.gray("Starting to Watch " + randomurl.toString() + "..."));

                        return StreamCustomPage(randomurl);


                    }




                }











            })

















        })




    })



}

async function pointscheck(points, status, onoff) {
    function bonus(status) {
        if (status) {
            return "claimed"
        } else {
            return "pending"
        }
    }

    if (onoff) {
        if (status) {
            return chalk.gray(" | Points: " + chalk.white(points) + " | Bonus: " + chalk.white(bonus(status)));
        } else {
            return chalk.gray(" | Points: " + chalk.white(points) + " | Bonus: " + chalk.white(bonus(status)));
        }
    } else {
        return " "
    }


}


async function farmpoint() {

    let PointsBtn = "//*[contains(concat(\" \",normalize-space(@class),\" \"),\" gShCOc \")]"
    let Bonus = "//*[contains(concat(\" \",normalize-space(@class),\" \"),\" VGQNd \")]"

    const [Points] = await watchingpage.$x(PointsBtn);
    const Pointscontent = await Points.getProperty('textContent')
    const rawpoints = await Pointscontent.jsonValue();
    //Ttv Status from Rust site
    let BonusStatus = false;

    try {
        let Bonusraw = await watchingpage.$x(Bonus);
        await Bonusraw[0].click();

        BonusStatus = true;
    } catch (e) {

    }

    return {Points: rawpoints, Bonus: BonusStatus}


}



module.exports = {
    StreamCustomPage
}


//Todo
//- Check ob alle chs bereits angeschaut wurden...