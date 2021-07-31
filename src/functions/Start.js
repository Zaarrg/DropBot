const chalk = require("chalk");
const {GetPaths} = require("./GetPahts");
const {Login} = require("../Pages/LoginPage")
const {Watch} = require("../Pages/WatchingPage")
const axios = require("axios");



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

        const BotVersion = "1.3.3.2"

        if (req.version !== BotVersion) {
            console.log(" ")
            console.log(chalk.green("New Version to download available...") + " | " + chalk.gray("Your Version: ") +  chalk.magenta(BotVersion) + " | " + chalk.gray("Newest Version: ") +  chalk.magenta(req.version))
        }
        //Check Version End


    //Ask for Chrome Path
    await GetPaths();
    //Login
    await Login();
    //Start Watching Process
    await Watch();




}

module.exports = {
    start
}