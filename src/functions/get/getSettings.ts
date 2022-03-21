import chalk from "chalk";
import {userdata} from "../../data/userdata"
import { validPath } from "../../utils/util";

const fs = require("fs");
const winston = require("winston");
const chromePaths = require('chrome-paths');
const inquirer = require("inquirer");
const inputReader = require("wait-console-input");

const path = './settings.json'
const opsys = process.platform;

export default async function () {

    if (fs.existsSync(path)) { //If settings file exists
        let settingsfile = fs.readFileSync('./settings.json', 'utf8');
        userdata.settings = await JSON.parse(settingsfile)

        await logimportantvalues()
        winston.info(" ");
        winston.info(chalk.green("Successfully Loaded Settings..."))
        winston.info(" ");
        if(userdata.settings.displayless && userdata.settings.Prioritylist.length === 0) {
            winston.warn(chalk.yellow('Warning: Please add Games to your Priorty List, otherwise the bot will select a random game...'))
        }
        return userdata.settings
    } else {
            await fs.writeFile('settings.json', JSON.stringify(userdata.settings, null, 2), function(err: any) {
                if (err) throw err;
                winston.info(" ");
                winston.info(chalk.green("Successfully Created Settings..."))
                winston.info(" ");
            });
    }
}

async function logimportantvalues() {
    if (userdata.settings.debug) {winston.info(chalk.cyan("Debug enabled"))}
    if (userdata.settings.displayless) {winston.info(chalk.cyan("Displayless mode enabled"))}
}

export async function Chromepaths() {

    await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: 'Found it! Is this your Google Chrome Path? | ' + chalk.cyan(chromePaths.chrome),

            },
        ])
        .then(async (Answer: {confirmed: boolean}) => {

            //If users selects yes
            if (Answer.confirmed) {

                //Check the Path
                if (opsys !== 'linux') {
                    if (fs.existsSync(chromePaths.chrome)) {
                        winston.info(" ")
                        userdata.settings.Chromeexe = await chromePaths.chrome //Set the Path
                    } else { //If auto detected path is invaild
                        winston.info(" ")
                        winston.info(chalk.red("Invalid Path... Please restart the Bot and provide a new one manually..."))
                        winston.info(" ")
                        if (!userdata.settings.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                        process.exit(21);
                    }
                } else {
                    winston.info(" ")
                    userdata.settings.Chromeexe = await chromePaths.chrome //Set the Path
                }

            } else { // If users selects no on auto detect providing it maunally

                winston.info(" ")
                await inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'pathexe',
                            message: 'Please provide your Google Chrome Executable path?',
                            validate: (value: string) => validPath(value),
                        },
                    ])
                    .then(async (Answer: {pathexe: string}) => {

                        winston.info(" ")
                        winston.info(chalk.gray("Setting Executable Path..."))

                        userdata.settings.Chromeexe = Answer.pathexe

                    });
            }
        });

}
