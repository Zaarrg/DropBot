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





async function Watch() {

    //Start Puppeteer Main Watching Page
    await puppeteer.launch({ headless: true, executablePath: data.settings[0].pathexe}).then(async browser => {
        let cookiesString = fs.readFileSync('./twitch-session.json', 'utf8');

        let cookies = JSON.parse(cookiesString);

        //Open New Tab
        const page = await browser.newPage()

        //Set Browser Data
        data.browser = browser;
        data.page = page;
        data.cookies = cookies

        //Ask for Custom Channels
        await CustomChannel().then( async () => {
            if (data.CustomChboolean === true) {
                //Start Custom Watching




                await StreamCustomPage(data.Startingchannel.Channel);

            } else {
                await intrust()
            }
        });

        async function intrust() {
            //Get All Rust Drops
            console.log(" ")
            console.log(chalk.gray('Getting all Drops and other Details'))

            //Go to Rust Twitch Drops
            await page.goto(data.rustdrops, {waitUntil: ["networkidle2"]})


            //Get Rust Drops From Rust Site
            await GetRustDrops(page,true).then(async r => {
                if (r === false) {
                    console.log(" ")
                    console.log(chalk.red('No Rust Drops available...'));
                    console.log(" ")
                    console.log(chalk.gray("Closing Bot and exiting..."));
                    console.log(" ")
                    inputReader.wait(chalk.gray("Press any Key to continue..."))
                    process.exit(20)
                }
            })

            //Let the User Select a Starting Ch
            await SelectStartingCh(true);

            //Start Watching
            data.browser = browser;
            data.page = page;
            data.cookies = cookies
            await StreamPage(data.Startingchannel.Channel).then(result => {
                console.log(result)
            });
        }






        console.log("All Done - Something went wrong...")
    })
}


module.exports = {
    Watch
}
