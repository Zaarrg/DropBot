const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const chromePaths = require('chrome-paths');
const inputReader = require("wait-console-input");
const {validPath} = require("../functions/util")
const data = require("../Data/SavedData");

const path = './settings.json'

let options = {
    'Chromeexe': "",
    'UserDataPath': "",
    'timeout': 30000,
    'headless': true,
    'debug': false
}

async function Getsettings() {

    if (fs.existsSync(path)) { //If settings file exists
        let settingsfile = fs.readFileSync('./settings.json', 'utf8');
        options = await JSON.parse(settingsfile)

        if (options.Chromeexe === "") {
            await Chromepaths();
        } else {
            console.log(" ");
            console.log(chalk.gray("Executable Path provided..."))
        }

        if (options.UserDataPath === "") {
            await UserData()
        } else {
            console.log(" ");
            console.log(chalk.gray("UserData Path provided..."))
        }

        await fs.writeFile('settings.json', JSON.stringify(options, null, 2), function(err) {
            if (err) throw err;
            console.log(" ");
            console.log(chalk.green("Successfully Saved Settings..."))
            console.log(" ");
        });

    } else {
        await Chromepaths()
        await UserData()

        await fs.writeFile('settings.json', JSON.stringify(options, null, 2), function(err) {
            if (err) throw err;
            console.log(" ");
            console.log(chalk.green("Successfully Saved Settings..."))
            console.log(" ");
        });
    }
    //Set some Values to saveddata.js
    await setsaveddatavalues()
    return options
}

async function setsaveddatavalues() {
    data.debug = options.debug
    if (options.debug === true) {console.log("Debug enabled")}
    data.headless = options.headless
    if (options.headless === false) {console.log("Headless mode disabled")}
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
                    console.log(" ")
                    options.Chromeexe = await chromePaths.chrome //Set the Path
                } else { //If auto detected path is invaild
                    console.log(" ")
                    console.log(chalk.red("Invalid Path... Please restart the Bot and provide a new one manually..."))
                    console.log(" ")
                    inputReader.wait(chalk.gray("Press any Key to continue..."))
                    process.exit(21);
                }

            } else { // If users selects no on auto detect providing it maunally

                console.log(" ")
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

                        console.log(" ")
                        console.log(chalk.gray("Setting Executable Path..."))
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

                        console.log(" ")
                        console.log(chalk.gray("Setting UserData path..."))

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