const chalk = require("chalk");
const fs = require("fs");
const data = require("../Data/SavedData");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {StreamCustomPage} = require("./StreamCustomPage");
const {CustomChannel} = require("../functions/CustomChannel");
const {StreamPage} = require("./StreamPage");
const {SelectStartingCh} = require("../functions/SelectStartingCh");
const {GetRustDrops} = require("../functions/GetRustDrops");
const inputReader = require('wait-console-input')
puppeteer.use(StealthPlugin())
const {parseTwitchDropsPage} = require("../functions/MapDrops");
const winston = require("winston");

async function Watch() {
    //Start Puppeteer Main Watching Page
    await puppeteer.launch({ headless: data.headless, executablePath: data.settings.Chromeexe, args: ['--no-sandbox']}).then(async browser => {
        let cookies;
        if (!fs.existsSync('./twitch-session.json') && data.displayless) {
            //Save Cookies
            const cookiepage = await browser.newPage()
            await cookiepage.setDefaultTimeout(data.settings.timeout)
            await cookiepage.goto(data.loginttv);
            winston.info(" ");
            winston.info(chalk.gray("Saving Cookies..."))
            cookies = await cookiepage.cookies();
            await fs.writeFile('twitch-session.json', JSON.stringify(cookies, null, 2), function(err) {
                if (err) throw err;
                winston.info(" ");
                winston.info(chalk.green("Successfully Saved Cookies..."))
                winston.info(" ");
            });
            cookiepage.close()
        } else {
            let cookiesString = fs.readFileSync('./twitch-session.json', 'utf8');
            cookies = JSON.parse(cookiesString);
        }
        //Open New Tab
        const page = await browser.newPage()
        await page.setDefaultTimeout(data.settings.timeout)
        //Set Browser Data
        data.browser = browser;
        data.page = page;
        data.cookies = cookies
        //Ask for Custom Channels
        await CustomChannel().then( async () => {
            if (data.CustomChboolean === true) {
                //Start Custom Watching
                await StreamCustomPage(data.Startingchannel);
            } else {
                await intrust()
            }
        });
        async function intrust() {
            //Get All Rust Drops
            winston.info(" ")
            winston.info(chalk.gray('Getting all Drops and other Details'))

            let campaignpage = undefined;

            if (data.settings.CheckClaimedOnStart) {
                campaignpage = await browser.newPage()
                await campaignpage.setCookie.apply(campaignpage, data.cookies);
                await campaignpage.goto('https://www.twitch.tv/drops/campaigns', {waitUntil: ["domcontentloaded", "networkidle2"]});
                await campaignpage.waitForSelector(`h3[title="Rust"]`); // default timeout is 30s
                const dropspage = await browser.newPage()
                await dropspage.goto('https://www.twitch.tv/drops/inventory', {waitUntil: ["domcontentloaded", "networkidle2"]});
                await dropspage.waitForSelector("main.twilight-main > div.root-scrollable"); // default timeout is 30s
                await parseTwitchDropsPage(dropspage).then(r => data.claimed = r[1])
                await dropspage.close();
            }
            //Go to Rust Twitch Drops
            await page.goto(data.rustdrops, {waitUntil: ["domcontentloaded", "networkidle2"]});
            await page.waitForSelector(`.section.streamer-drops, .section.general-drops, .section.is-getstarted`); // default wait for 10s
            //Get Rust Drops From Rust Site
            await GetRustDrops(page, campaignpage,true).then(async r => {
                if (data.debug) winston.debug("DEBUG: GetRustDrops Result: " + JSON.stringify(r))
                if (r.length === 0) {
                    winston.info(" ")
                    winston.info(chalk.red('No Rust Drops available...'));
                    winston.info(" ")
                    winston.info(chalk.gray("Closing Bot and exiting..."));
                    winston.info(" ")
                    if (!data.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                    process.exit(20)
                }
            })
            if (data.debug) {
                winston.debug("DEBUG: Rust Drops: ")
                data.Streamers.forEach((element) => winston.info(element))
                winston.debug("DEBUG END")
            }
            //Let the User Select a Starting Ch
            await SelectStartingCh(true);
            //Start Watching
            data.browser = browser;
            data.page = page;
            data.cookies = cookies
            await StreamPage(data.Startingchannel).then(result => {
                winston.info(result)
            });
        }
        winston.info("All Done - Something went wrong...")
    })
}
module.exports = {
    Watch
}
