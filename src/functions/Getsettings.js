const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const chromePaths = require('chrome-paths');
const inputReader = require("wait-console-input");
const {validPath} = require("../functions/util")
const data = require("../Data/SavedData");
const {displayless} = require("../Data/SavedData");
const winston = require("winston");

const path = './settings.json'

let options = {
    'Chromeexe': "",
    'UserDataPath': "",
    'timeout': 0,
    'headless': true,
    'debug': false,
    'displayless': false,
    'CheckClaimedOnStart': true,
    'SkipLoginPage': false,
    'ProgressCheckInterval': 60000,
    'AutoClaim': true,
    'LogToFile': false
}

async function Getsettings() {

    if (fs.existsSync(path)) { //If settings file exists
        let settingsfile = fs.readFileSync('./settings.json', 'utf8');
        options = await JSON.parse(settingsfile)

        if (options.Chromeexe === "") {
            if (options.displayless === false) {
                await Chromepaths();
            } else {
                winston.error("No Chrome path found in settings.json")
                process.exit(1)
            }

        } else {
            winston.info(" ");
            winston.info(chalk.gray("Executable Path provided..."))
        }

        if (options.UserDataPath === "") {
            if (options.displayless === false) {
                await UserData()
            } else {
                if (fs.existsSync('./twitch-session.json')) {
                    winston.info(" ");
                    winston.info(chalk.gray("Cookies provided..."))
                } else {
                    winston.error("No UserData or Cookies found...")
                    process.exit(1)
                }
            }
        } else {
            winston.info(" ");
            winston.info(chalk.gray("UserData Path provided..."))
        }

        await fs.writeFile('settings.json', JSON.stringify(options, null, 2), function(err) {
            if (err) throw err;
            winston.info(" ");
            winston.info(chalk.green("Successfully Saved Settings..."))
            winston.info(" ");
        });

    } else {
        const opsys = process.platform;
        if (opsys === 'win32') {
            await Chromepaths()
            await UserData()

            await fs.writeFile('settings.json', JSON.stringify(options, null, 2), function(err) {
                if (err) throw err;
                winston.info(" ");
                winston.info(chalk.green("Successfully Saved Settings..."))
                winston.info(" ");
            });
        } else {
            winston.error('Please provide a settings.json to read...')
            process.exit(1)
        }
    }
    //Set some Values to saveddata.js
    await setsaveddatavalues()
    return options
}

async function setsaveddatavalues() {
    data.debug = options.debug
    if (options.debug === true) {winston.debug(chalk.cyan("\nDebug enabled"))}
    data.headless = options.headless
    if (options.headless === false) {winston.info(chalk.cyan("\nHeadless mode disabled"))}
    data.displayless = options.displayless
    if (options.displayless === true) {winston.info(chalk.cyan("\nDisplayless mode enabled"))}
    data.UserDataPath = options.UserDataPath
}

async function Chromepaths() {

    await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: 'Found it! Is this your Google Chrome Path? | ' + chalk.cyan(chromePaths.chrome),

            },
        ])
        .then(async (answers) => {

            let Pathawnser = JSON.stringify(answers, null, '  ');
            Pathawnser = JSON.parse(Pathawnser);

            //If users selects yes
            if (Pathawnser.confirmed === true) {

                //Check the Path
                if (fs.existsSync(chromePaths.chrome)) {
                    winston.info(" ")
                    options.Chromeexe = await chromePaths.chrome //Set the Path
                } else { //If auto detected path is invaild
                    winston.info(" ")
                    winston.info(chalk.red("Invalid Path... Please restart the Bot and provide a new one manually..."))
                    winston.info(" ")
                    if (!data.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                    process.exit(21);
                }

            } else { // If users selects no on auto detect providing it maunally

                winston.info(" ")
                await inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'pathexe',
                            message: 'Please provide your Google Chrome Executable path?',
                            validate: (value) => validPath(value),
                        },
                    ])
                    .then(async (answers) => {

                        winston.info(" ")
                        winston.info(chalk.gray("Setting Executable Path..."))
                        let Executablepath = JSON.stringify(answers, null, '  ');
                        Executablepath = JSON.parse(Executablepath);

                        options.Chromeexe = await Executablepath.pathexe

                    });

            }
        });

}

async function UserData() {

    await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: 'Do you wanna use a custom UserDataDirectory?',
            },
        ])
        .then(async (answers) => {

            let UserDataDirboolean = JSON.stringify(answers, null, '  ');
            UserDataDirboolean = JSON.parse(UserDataDirboolean);

            if (UserDataDirboolean.confirmed === true) {

                await inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'UserDataPath',
                            message: 'Please provide your UserDataDirectory Path?',
                        },
                    ])
                    .then(async (answers) => {

                        winston.info(" ")
                        winston.info(chalk.gray("Setting UserData path..."))

                        let UserDataDir = JSON.stringify(answers, null, '  ');
                        UserDataDir = JSON.parse(UserDataDir);

                        options.UserDataPath = await UserDataDir.UserDataPath

                    });
            } else {
                return options.UserDataPath = ''
            }
        });


}

module.exports = {
    Getsettings
}