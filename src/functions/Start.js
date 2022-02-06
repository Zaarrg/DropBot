const chalk = require("chalk");
const {Getsettings} = require("./Getsettings");
const {Login} = require("../Pages/LoginPage")
const {Watch} = require("../Pages/WatchingPage")
const axios = require("axios");
const data = require("../Data/SavedData");
const winston = require('winston');
const {format} = require("winston");
const fs = require("fs");
const { printf } = format;


async function start() {
    //Logger Start
    //Log to File
    const fileFormat = printf((log) => {
        return `${log.timestamp}: ${log.message}`
    });
    const consoleFormat = printf((log) => {
        return log.message
    })

    // Logger configuration
    process.on('unhandledRejection', (reason, promise) => {
        throw reason;})
    if (fs.existsSync('./settings.json')) {
        let settingsfile = fs.readFileSync('./settings.json', 'utf8');
        options = await JSON.parse(settingsfile)
        if (options.LogToFile) {
            winston.add(new winston.transports.File({
                filename: './TTVDropBot-out.log',
                level: 'info',
                handleExceptions: true,
                RejectionHandler: true,
                maxsize: 10242880,
                maxFiles: 10,
                timestamp: true,
                format: format.combine(
                    format.uncolorize(),
                    format.splat(),
                    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                    fileFormat,
                )
            }));
            winston.add(new winston.transports.File({
                filename: './TTVDropBot-error.log',
                level: 'error',
                handleExceptions: true,
                RejectionHandler: true,
                maxsize: 10242880,
                maxFiles: 10,
                timestamp: true,
                format: format.combine(
                    format.uncolorize(),
                    format.splat(),
                    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                    fileFormat,
                )
            }));
        }
    }
    winston.add(new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        RejectionHandler: true,
        format: format.combine(
            format.prettyPrint(),
            format.splat(),
            consoleFormat
        )
    }));
    //Logger END
    winston.info(" ");
    winston.info(chalk.gray("Starting..."))
        //Check Version
        const url = 'http://144.91.124.143:3004/ttvdropbot-dev';
        const req = await axios.get(url)
            .then(data => {
                return data.data;
            })
            .catch(err =>winston.info(err));
        const BotVersion = "1.3.3.5"
        if (req.version !== BotVersion) {
            winston.info(" ")
            winston.info(chalk.green("New Version to download available...") + " | " + chalk.gray("Your Version: ") +  chalk.magenta(BotVersion + " (main)") + " | " + chalk.gray("Newest Version: ") +  chalk.magenta(req.version))
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