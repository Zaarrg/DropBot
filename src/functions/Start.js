const chalk = require("chalk");
const {Getsettings} = require("./Getsettings");
const {Login} = require("../Pages/LoginPage")
const {Watch} = require("../Pages/WatchingPage")
const axios = require("axios");
const data = require("../Data/SavedData");



async function start() {

    console.log(" ");
    console.log(chalk.gray("Starting..."))

        //Check Version
        const url = 'http://144.91.124.143:3004/ttvdropbot-dev';

        const req = await axios.get(url)
            .then(data => {
                return data.data;
            })
            .catch(err =>console.log(err));

        const BotVersion = "1.3.3.4"

        if (req.version !== BotVersion) {
            console.log(" ")
            console.log(chalk.green("New Version to download available...") + " | " + chalk.gray("Your Version: ") +  chalk.magenta(BotVersion + " (dev)") + " | " + chalk.gray("Newest Version: ") +  chalk.magenta(req.version))
        }
        //Check Version End


    //Get Settings
    await Getsettings().then(async (result) => {
        data.settings = result
        //Login
        await Login();
        //Start Watching Process
        await Watch();
    })




}

module.exports = {
    start
}