

//Start Puppeteer LoginPage
const chalk = require("chalk");
const fs = require("fs");

const data = require("../Data/SavedData");


const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


async function Login() {
    await puppeteer.launch({ headless: false, executablePath: data.settings[0].pathexe, userDataDir: data.settings[1].UserDataPath}).then(async browser => {



        //Open Login Page
        const loginpage = await browser.newPage()

        //Goto Login Page
        console.log(" ");
        console.log(chalk.gray("Starting Login Page..."))
        await loginpage.goto(data.loginttv, {waitUntil: "networkidle2"})
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


