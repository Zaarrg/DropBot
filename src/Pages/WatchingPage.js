const chalk = require("chalk");
const fs = require("fs");

const data = require("../Data/SavedData");

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {StreamPage} = require("./StreamPage");
const {SelectStartingCh} = require("../functions/SelectStartingCh");
const {GetRustDrops} = require("../functions/GetRustDrops");
puppeteer.use(StealthPlugin())





async function Watch() {

    //Start Puppeteer Main Watching Page
    await puppeteer.launch({ headless: true, executablePath: data.settings[0].pathexe}).then(async browser => {
        let cookiesString = fs.readFileSync('./twitch-session.json', 'utf8');

        let cookies = JSON.parse(cookiesString);

        //Open New Tab
        const page = await browser.newPage()

        //Get All Rust Drops
        console.log(" ")
        console.log(chalk.gray('Getting all Drops and other Details'))

        //Go to Rust Twitch Drops
        await page.goto(data.rustdrops, {waitUntil: ["networkidle2"]})


        //Get Rust Drops From Rust Site
        await GetRustDrops(page,true)

        //Let the User Select a Starting Ch
        await SelectStartingCh();

        //Start Watching
        data.browser = browser;
        data.page = page;
        data.cookies = cookies
        await StreamPage(data.Startingchannel.Channel).then(result => {
            console.log(result)
        });





        console.log(`Something Went Wrong - All done`)
    })
}


module.exports = {
    Watch
}
