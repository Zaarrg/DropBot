const chalk = require("chalk");
const {GetPaths} = require("./GetPahts");
const {Login} = require("../Pages/LoginPage")
const {Watch} = require("../Pages/WatchingPage")


async function start() {

    console.log(" ");
    console.log(chalk.gray("Starting..."))


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