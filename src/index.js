const chalk = require('chalk')
const puppeteer = require('puppeteer-extra')
const inquirer = require('inquirer')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require("fs");
puppeteer.use(StealthPlugin())

//Twitch Drops
const rustdrops = "https://twitch.facepunch.com/"
const loginttv = "https://www.twitch.tv/login"


//Who is Live
let Drop1 = {};
let Drop2 = {};
let Drop3 = {};
let Drop4 = {};
let Drop5 = {};
let Drop6 = {};
let Drop7 = {};
let Drop8 = {};
let Drop9 = {};

//Live Channels
let choi = [];
let dropsmap = [];

//starting ch
let Startingchannel;

let Executablepath;

//Cookies
let LoginPageCookies;
//settings
let settings = [];


//Start
init();

async function init() {
    console.log(" ");
    console.log(chalk.gray("Starting..."))

    async function askforexepath() {

        const path = './settings.json'

        if (fs.existsSync(path)) {
            let settingsfile = fs.readFileSync('./settings.json', 'utf8');
            settings = JSON.parse(settingsfile);
            if (settings.pathprovided === false) {
                await inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'pathexe',
                            message: 'Please provide your Google Chrome Executable path?',
                        },
                    ])
                    .then((answers) => {

                        console.log(" ")
                        console.log(chalk.gray("Setting Executable Path..."))
                        Executablepath = JSON.stringify(answers, null, '  ');
                        Executablepath = JSON.parse(Executablepath);

                        settings.push({pathexe: Executablepath.pathexe, pathprovided: true})

                    });
                await fs.writeFile('settings.json', JSON.stringify(settings, null, 2), function(err) {
                    if (err) throw err;
                    console.log(" ");
                    console.log(chalk.green("Successfully Saved Executable Path..."))
                    console.log(" ");
                });
            } else {
                console.log(" ");
                console.log(chalk.gray("Executable Path provided..."))
            }
        } else {
            await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'pathexe',
                        message: 'Please provide your Google Chrome Executable path?',
                    },
                ])
                .then((answers) => {

                    console.log(" ")
                    console.log(chalk.gray("Setting Executable Path..."))
                    Executablepath = JSON.stringify(answers, null, '  ');
                    Executablepath = JSON.parse(Executablepath);

                    settings.push({pathexe: Executablepath.pathexe, pathprovided: true})

                });
            await fs.writeFile('settings.json', JSON.stringify(settings, null, 2), function(err) {
                if (err) throw err;
                console.log(" ");
                console.log(chalk.green("Successfully Saved Executable Path..."))
                console.log(" ");
            });
        }
    }
    //Ask for Chrome Path
    await askforexepath();

    //Start Puppeteer LoginPage
    await puppeteer.launch({ headless: false, executablePath: settings[0].pathexe}).then(async browser => {



        //Open Login Page
        const loginpage = await browser.newPage()

        //Goto Login Page
        console.log(" ");
        console.log(chalk.gray("Starting Login Page..."))
        await loginpage.goto(loginttv, {waitUntil: "networkidle2"})
        //Wait for User to Login
        console.log(" ");
        console.log(chalk.gray("Please Login with you Account..."))
        try {
            await loginpage.waitForFunction(
                'document.querySelector(\'title\').innerText.toString() === "Twitch"', { timeout: 300000 }
            );
        } catch (error) {
            console.log(chalk.red("Closing... You did not Login in Time"))
            process.exit(22);
        }
        console.log(" ");
        console.log(chalk.green("Success Login..."))
        //Save Cookies
        console.log(" ");
        console.log(chalk.gray("Saving Cookies..."))
        LoginPageCookies = await loginpage.cookies();

        await fs.writeFile('twitch-session.json', JSON.stringify(LoginPageCookies, null, 2), function(err) {
            if (err) throw err;
            console.log(" ");
            console.log(chalk.green("Successfully Saved Cookies..."))
            console.log(" ");
        });

        //Close Browser
        console.log(" ");
        console.log(chalk.gray("Closing Browser and Moving on..."))
        await browser.close()
        main();
    })

    async function main() {
        //Start Puppeteer Main Watching Page
        await puppeteer.launch({ headless: true, executablePath: settings[0].pathexe}).then(async browser => {
            let cookiesString = fs.readFileSync('./twitch-session.json', 'utf8');

            let cookies = JSON.parse(cookiesString);


            //Open New Tab
            const page = await browser.newPage()
            //Get All Rust Drops
            console.log(" ")
            console.log(chalk.gray('Getting all Drops and other Details'))
            //Go to Rust Twitch Drops
            await page.goto(rustdrops, {waitUntil: "networkidle2"})





            //Get Drops
            async function getdrops(ttvlink, stat, drp, feedback) {

                const [link] = await page.$x(ttvlink);
                const linkhref = await link.getProperty('href')
                const rawlink = await linkhref.jsonValue();
                //Ttv Status from Rust site
                const [status] = await page.$x(stat);
                const statuscontent = await status.getProperty('textContent')
                const statusraw = await statuscontent.jsonValue();
                //Drop Item Name
                const [drop] = await page.$x(drp);
                const dropcontent = await drop.getProperty('textContent')
                const dropraw = await dropcontent.jsonValue();

                if (feedback === true) {
                    console.log(" ")
                    console.log(chalk.cyan(rawlink) + " | " + chalk.magenta(dropraw)+ " | " + statuscheck(JSON.stringify(statusraw)))
                }




                return {
                    link: rawlink,
                    Status: statusraw,
                    Drop: dropraw
                }
            }


            async function intgettingDrops(feedback) {
                //Drop 1
                await getdrops('/html/body/div[1]/div[3]/div[2]/a[1]', '/html/body/div[1]/div[3]/div[2]/a[1]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[2]/a[1]/h3', feedback).then(a => {
                    Drop1 = {Name: a.link, Item: a.Drop, Status: statuscheck(a.Status)}
                })
                //Drop 2
                await getdrops('/html/body/div[1]/div[3]/div[2]/a[2]', '/html/body/div[1]/div[3]/div[2]/a[2]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[2]/a[2]/h3', feedback).then(a => {
                    Drop2 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 3
                await getdrops('/html/body/div[1]/div[3]/div[2]/a[3]', '/html/body/div[1]/div[3]/div[2]/a[3]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[2]/a[3]/h3', feedback).then(a => {
                    Drop3 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 4
                await getdrops('/html/body/div[1]/div[3]/div[3]/a[1]', '/html/body/div[1]/div[3]/div[3]/a[1]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[3]/a[1]/h3', feedback).then(a => {
                    Drop4 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 5
                await getdrops('/html/body/div[1]/div[3]/div[3]/a[2]', '/html/body/div[1]/div[3]/div[3]/a[2]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[3]/a[2]/h3', feedback).then(a => {
                    Drop5 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 6
                await getdrops('/html/body/div[1]/div[3]/div[3]/a[3]', '/html/body/div[1]/div[3]/div[3]/a[3]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[3]/a[3]/h3', feedback).then(a => {
                    Drop6 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 7
                await getdrops('/html/body/div[1]/div[3]/div[4]/a[1]', '/html/body/div[1]/div[3]/div[4]/a[1]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[4]/a[1]/h3', feedback).then(a => {
                    Drop7 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 8
                await getdrops('/html/body/div[1]/div[3]/div[4]/a[2]', '/html/body/div[1]/div[3]/div[4]/a[2]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[4]/a[2]/h3', feedback).then(a => {
                    Drop8 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
                //Drop 9
                await getdrops('/html/body/div[1]/div[3]/div[4]/a[3]', '/html/body/div[1]/div[3]/div[4]/a[3]/div[1]/div[2]', '/html/body/div[1]/div[3]/div[4]/a[3]/h3', feedback).then(a => {
                    Drop9 = {Name: a.link, Item: a.Drop,  Status: statuscheck(a.Status)}
                })
            }
            //Start GEtting Drops
            await intgettingDrops(true);



            async function checklive() {
                console.log(" ")
                console.log(chalk.gray("Checking for Live Channels"))

                if (statuscheckboolean(Drop1.Status)) {
                    choi.push(Drop1.Name)
                }
                if (statuscheckboolean(Drop2.Status)) {
                    choi.push(Drop2.Name)
                }
                if (statuscheckboolean(Drop3.Status)) {
                    choi.push(Drop3.Name)
                }
                if (statuscheckboolean(Drop4.Status)) {
                    choi.push(Drop4.Name)
                }
                if (statuscheckboolean(Drop5.Status)) {
                    choi.push(Drop5.Name)
                }
                if (statuscheckboolean(Drop6.Status)) {
                    choi.push(Drop6.Name)
                }
                if (statuscheckboolean(Drop7.Status)) {
                    choi.push(Drop7.Name)
                }
                if (statuscheckboolean(Drop8.Status)) {
                    choi.push(Drop8.Name)
                }
                if (statuscheckboolean(Drop9.Status)) {
                    choi.push(Drop9.Name)
                }

            }


            async function startingch() {
                //Check for Live Channels and add them to List
                await checklive();

                await inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'Channel',
                            message: 'Select Twitch Channel to start Watching?',
                            choices: choi,
                        },
                    ])
                    .then((answers) => {

                        console.log(" ")
                        console.log(chalk.gray("Setting Starting Channel..."))
                        Startingchannel = JSON.stringify(answers, null, '  ');
                        Startingchannel = JSON.parse(Startingchannel);
                    });
            }





            //Let the User Select a Starting Ch
            await startingch();
            //Start Watching
            await startwatching(Startingchannel.Channel);


            async function startwatching(startch) {
                //Open New Tab to the Starting ch
                console.log(" ")
                console.log(chalk.gray("Going to Starting Channel..."))
                //Open Watching Tab
                const watchingpage = await browser.newPage();
                //Open Drops PAge tab
                const dropspage = await browser.newPage();
                //Set Cookies
                await dropspage.setCookie.apply(dropspage, cookies);
                //Set Cookies
                await watchingpage.setCookie.apply(watchingpage, cookies);
                //Goto Selectetd Starting Ch
                await watchingpage.goto(startch)
                //Goto Twitch inv
                await dropspage.goto('https://www.twitch.tv/drops/inventory', {waitUntil: "networkidle2"})
                //Check for 18+
                console.log(" ")
                console.log(chalk.gray("Setting Video Settings like Quality and Volume..."))
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

                //Progress

                async function checkprogress() {

                    await intgettingDrops(false);
                    await mapdrops()

                        for (let i = 0; i < dropsmap.length; i++)
                        {
                            if (ciEquals(dropsmap[i].tvlink, startch)) {
                                return dropsmap[i].percent
                            }
                        }

                }

                async function delay(ms) {
                    // return await for better async stack trace support in case of errors.
                    return await new Promise(resolve => setTimeout(resolve, ms));
                }

                let retry = 0;

                async function run() {
                    await delay(60000).then( async () => {
                        await checkprogress().then(async (a) => {
                            await checkifoffilne(startch).then(async (b) => {
                                if (b === true) {
                                    if (a === undefined) {
                                        retry++
                                        if (retry < 3) {
                                            console.log(chalk.gray("Current Progress: ") + chalk.white("-" + " %") + chalk.gray(" | Try: ") + chalk.white(retry));
                                            return await run();
                                        } else if (retry === 3) {
                                            console.log(" ")
                                            console.log(chalk.red("Failed to get a valid Drop to progress on this Channel... Looking for a new one... "));
                                            retry = 0;
                                            await checklive().then(async () => {
                                                dropspage.close();
                                                watchingpage.close();
                                                return await startwatching(choi[getRandomInt(choi.length)]);
                                            })
                                        }
                                    } else if (a < 100) {
                                        console.log(chalk.gray("Current Progress: ") + chalk.white(a + " %") + chalk.gray(" | " + etacalc(a)));
                                        return await run();
                                    } else if (a === 100) {
                                        //100%
                                        console.log(" ")
                                        console.log(chalk.cyan("Reached ") + chalk.green("100 %... ") + chalk.cyan("Looking for new Channel..."));
                                        await checklive().then(async () => {
                                            dropspage.close();
                                            watchingpage.close();
                                            return await startwatching(choi[getRandomInt(choi.length)]);
                                        })
                                    }

                                } else if (b === false) {
                                        dropspage.close();
                                        watchingpage.close();
                                        return await startwatching(choi[getRandomInt(choi.length)]);
                                }
                            })
                        });
                    }) //5
                }

                await run();


                async function mapdrops() {
                    await dropspage.reload({
                        waitUntil: ["networkidle2", "domcontentloaded"]
                    })
                    dropsmap = [];

                    //Check if drop exist then map it.
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[3]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[3]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[3]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(3) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(3) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop2
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[4]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[4]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[4]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(4) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(4) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop3
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[5]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[5]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[5]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(5) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(5) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop4
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[6]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[6]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[6]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(6) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(6) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop5
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[7]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[7]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[7]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(7) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(7) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop6
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[8]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[8]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[8]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(8) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(8) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop7
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[9]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[9]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[9]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(9) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(9) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop8
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[10]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[10]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[10]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(10) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(10) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                    //Drop9
                    await checkdrop('//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[11]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/p', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[11]/div[2]/div/div[1]/div[2]/div[2]/p/span', '//*[@id="root"]/div/div[2]/div/main/div[2]/div[3]/div/div/div/div/div/div/div[2]/div[11]/div[1]/div[3]/div[2]/div/p/a', '#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(11) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-visible > div.tw-align-center.tw-mg-t-05 > p > span','#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div > div.inventory-max-width > div:nth-child(11) > div.tw-pd-x-3.tw-pd-y-1 > div > div.tw-flex.tw-flex-column.tw-mg-t-2 > div.tw-flex.tw-flex-grow-1 > div > div > div.tw-align-items-center.tw-c-background-alt.tw-flex.tw-justify-content-center.tw-pd-2.tw-relative > div.tw-absolute.tw-align-items-center.tw-c-background-overlay.tw-c-text-overlay.tw-flex.tw-full-height.tw-full-width.tw-justify-content-center.tw-left-0.tw-top-0 > button')
                }




                async function checkdrop(droppath, perecentpath, ttvlink, slectorpath, claimable) {

                    let checkdroppath = await dropspage.$(slectorpath);

                    let checkclaim = await dropspage.$(claimable);

                    if (await checkdroppath !== null) {
                        const [precent] = await dropspage.$x(perecentpath);
                        const percentcontent = await precent.getProperty('textContent')
                        const rawprecent = await percentcontent.jsonValue();
                        //Drop Item Name
                        const [name] = await dropspage.$x(droppath);
                        const namecontent = await name.getProperty('textContent')
                        const nameraw = await namecontent.jsonValue();
                        //ttv link
                        const [link] = await dropspage.$x(ttvlink);
                        const linkhref = await link.getProperty('href')
                        const rawlink = await linkhref.jsonValue();

                        dropsmap.push({name: nameraw.toString(), tvlink: rawlink, percent: Number(rawprecent), claim: false})
                        return true;

                    } else if (await checkclaim !== null){
                        //Drop Item Name
                        const [name] = await dropspage.$x(droppath);
                        const namecontent = await name.getProperty('textContent')
                        const nameraw = await namecontent.jsonValue();
                        //ttv link
                        const [link] = await dropspage.$x(ttvlink);
                        const linkhref = await link.getProperty('href')
                        const rawlink = await linkhref.jsonValue();

                        dropsmap.push({name: nameraw.toString(), tvlink: rawlink, percent: 100, claim: true})
                        return true;

                    } else {
                        return false;
                    }
                }








                async function checkifoffilne(currentchlink) {
                    //Check Drop 1
                    if (currentchlink === Drop1.Name) {
                        if (!statuscheckboolean(Drop1.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop2
                    if (currentchlink === Drop2.Name) {
                        if (!statuscheckboolean(Drop2.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop3
                    if (currentchlink === Drop3.Name) {
                        if (!statuscheckboolean(Drop3.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop4
                    if (currentchlink === Drop4.Name) {
                        if (!statuscheckboolean(Drop4.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop5
                    if (currentchlink === Drop5.Name) {
                        if (!statuscheckboolean(Drop5.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop 5
                    if (currentchlink === Drop6.Name) {
                        if (!statuscheckboolean(Drop6.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop 6
                    if (currentchlink === Drop7.Name) {
                        if (!statuscheckboolean(Drop7.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop 7
                    if (currentchlink === Drop8.Name) {
                        if (!statuscheckboolean(Drop8.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop 8
                    if (currentchlink === Drop9.Name) {
                        if (!statuscheckboolean(Drop9.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                    //Drop 9
                    if (currentchlink === Drop1.Name) {
                        if (!statuscheckboolean(Drop1.Status)) {
                            console.log(" ")
                            console.log(chalk.gray("Current Channel Offline looking for new one..."))
                            await checklive();
                            return false
                        } else {
                            return true;
                        }
                    }
                }




            }





            console.log(`All done`)



        })
    }
}

function etacalc(a) {
    let result = 120-(120/100*a)
    let resultr = Math.round((result + Number.EPSILON) * 100) / 100;
    if (result === 1) {
        return chalk.gray(resultr + " Minute left")
    } else if (result <= 120) {
        return chalk.gray(resultr + " Minutes left")
    } else {
        return chalk.gray("-" + " Minutes left")
    }
}

function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function statuscheck(raw) {
    if(raw.includes("Offline")) {
        return chalk.red("Offline")
    } else {
        return chalk.greenBright("Live")
    }
}

function statuscheckboolean(status) {
    if(status.includes("Offline")) {
        return false
    } else {
        return true
    }
}







