import chalk from "chalk";
import { userdata } from "../index";

const winston = require("winston");
const fs = require("fs");
const inputReader = require("wait-console-input");
const puppeteer = require('puppeteer-core')

export async function Login() {
    await puppeteer.launch({ headless: false , executablePath: userdata.settings.Chromeexe, userDataDir: userdata.settings.UserDataPath, args: ['--no-sandbox']}).then(async (browser: any) => {
        //Open Login Page
        const loginpage = await browser.newPage()
        await loginpage.setDefaultTimeout(0)
        //Set Cookies if found for Autologin
        if (userdata.settings.UserDataPath === "" && fs.existsSync('./twitch-session.json')) {
            let file = fs.readFileSync('./twitch-session.json', 'utf8');
            let cokkies = await JSON.parse(file)
            await loginpage.setCookie.apply(loginpage, cokkies);
        }
        //Goto Login Page
        winston.silly(" ");
        winston.info(chalk.gray("Starting Login Page..."))
        await loginpage.goto(userdata.loginpageurl, {waitUntil: "networkidle2"})

        await loginpage.waitForNavigation().then(async () => {
            if (loginpage.url() !== 'https://www.twitch.tv/?no-reload=true') {
                if (!userdata.settings.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                process.exit(22);
            }

            winston.silly(" ");
            winston.info(chalk.green("Success Login..."))
            //Save Cookies
            winston.silly(" ");
            winston.info(chalk.gray("Saving Cookies..."))
            userdata.cookies = await loginpage.cookies();

            await fs.promises.writeFile('twitch-session.json', JSON.stringify(userdata.cookies, null, 2)).then(function () {
                winston.silly(" ");
                winston.info(chalk.green("Successfully Saved Cookies..."))
                winston.silly(" ");
            }).catch((err: any) => {throw err})
        })
        //Close Browser
        winston.silly(" ");
        winston.info(chalk.gray("Closing Browser and Moving on..."))
        await browser.close()
    })
}


