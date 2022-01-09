

//Start Puppeteer LoginPage
const chalk = require("chalk");
const fs = require("fs");
const data = require("../Data/SavedData");


const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const inputReader = require("wait-console-input");
puppeteer.use(StealthPlugin())


async function Login() {

    await puppeteer.launch({ headless: false, executablePath: data.settings.Chromeexe, userDataDir: data.settings.UserDataPath}).then(async browser => {



        //Open Login Page
        const loginpage = await browser.newPage()
        await loginpage.setDefaultTimeout(data.settings.timeout)

        //Goto Login Page
        console.log(" ");
        console.log(chalk.gray("Starting Login Page..."))
        await loginpage.goto(data.loginttv, {waitUntil: "networkidle2"})
        //Wait for User to Login
        console.log(" ");
        console.log(chalk.gray("Please Login with you Account..."))
        try {
            await loginpage.waitForFunction(
                'document.querySelector(\'title\').innerText.toString() === "Twitch" ? true : /\\([0-9]+\\) Twitch$/.test(document.querySelector(\'title\').innerText.toString())'
            ); //Default 30s timeout
        } catch (error) {
            console.log(chalk.red("Closing... You did not Login in Time"))
            inputReader.wait(chalk.gray("Press any Key to continue..."))
            process.exit(22);
        }
        console.log(" ");
        console.log(chalk.green("Success Login..."))
        //Save Cookies
        console.log(" ");
        console.log(chalk.gray("Saving Cookies..."))
        data.LoginPageCookies = await loginpage.cookies();

        await fs.writeFile('twitch-session.json', JSON.stringify(data.LoginPageCookies, null, 2), function(err) {
            if (err) throw err;
            console.log(" ");
            console.log(chalk.green("Successfully Saved Cookies..."))
            console.log(" ");
        });

        //Close Browser
        console.log(" ");
        console.log(chalk.gray("Closing Browser and Moving on..."))
        await browser.close()
    })

}

module.exports = {
    Login
}


