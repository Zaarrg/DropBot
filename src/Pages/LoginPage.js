//Start Puppeteer LoginPage
const chalk = require("chalk");
const fs = require("fs");
const data = require("../Data/SavedData");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const inputReader = require("wait-console-input");
const {displayless} = require("../Data/SavedData");
const winston = require("winston");
puppeteer.use(StealthPlugin())


async function Login() {
    await puppeteer.launch({ headless: (data.displayless || data.settings.SkipLoginPage) , executablePath: data.settings.Chromeexe, userDataDir: data.settings.UserDataPath, args: ['--no-sandbox']}).then(async browser => {
        //Open Login Page
        const loginpage = await browser.newPage()
        await loginpage.setDefaultTimeout(data.settings.timeout)
        //Set Cookies if found for Autologin
        if (data.UserDataPath === "" && fs.existsSync('./twitch-session.json')) {
            let file = fs.readFileSync('./twitch-session.json', 'utf8');
            let cokkies = await JSON.parse(file)
            await loginpage.setCookie.apply(loginpage, cokkies);
        }
        //Goto Login Page
        winston.info(" ");
        winston.info(chalk.gray("Starting Login Page..."))
        await loginpage.goto(data.loginttv, {waitUntil: "networkidle2"})
        //Wait for User to Login
        winston.info(" ");
        winston.info(chalk.gray("Please Login with you Account..."))
        if (data.debug && displayless) {
            await loginpage.screenshot({path: 'screenshot.png'})
            winston.info("DEBUG: Status Screen of Loginpage")
        }
        try {
            await loginpage.waitForFunction(
                "document.querySelector('title').innerText.toString() === 'Twitch' ? true : /\\([0-9]+\\) Twitch$/.test(document.querySelector('title').innerText.toString())"
            ); //Default 30s timeout
        } catch (error) {
            try {
                await loginpage.waitForFunction(
                    "document.querySelector('title').innerText.toString() === 'Twitch' ? true : /\\([0-9]+\\) Twitch$/.test(document.querySelector('title').innerText.toString())"
                ); //Default 30s timeout
            } catch (e) {
                try {
                    await loginpage.waitForFunction(
                        "document.querySelector('title').innerText.toString() === 'Twitch' ? true : /\\([0-9]+\\) Twitch$/.test(document.querySelector('title').innerText.toString())"
                    ); //Default 30s timeout
                } catch (e) {
                    winston.info(chalk.red("Closing... You did not Login in Time"))
                    if (!data.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                    process.exit(22);
                }
            }
        }
        winston.info(" ");
        winston.info(chalk.green("Success Login..."))
        //Save Cookies
        winston.info(" ");
        winston.info(chalk.gray("Saving Cookies..."))
        data.LoginPageCookies = await loginpage.cookies();

        await fs.writeFile('twitch-session.json', JSON.stringify(data.LoginPageCookies, null, 2), function(err) {
            if (err) throw err;
            winston.info(" ");
            winston.info(chalk.green("Successfully Saved Cookies..."))
            winston.info(" ");
        });

        //Close Browser
        winston.info(" ");
        winston.info(chalk.gray("Closing Browser and Moving on..."))
        await browser.close()
    })
}

module.exports = {
    Login
}


