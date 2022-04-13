import fs from "fs";
import {userdata} from "../../index" ;
import winston from "winston";
import chalk from "chalk";
import {getRandomInt, statustoString, validURL} from "../../utils/util";
const inputReader = require("wait-console-input");
const inquirer = require("inquirer");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();

export async function getCustomChannel() {
    const path = './CustomChannels.json'

    if (!userdata.settings.displayless) {

        if(fs.existsSync(path)) {
            let customch = fs.readFileSync('./CustomChannels.json', 'utf8');
            userdata.customchannel = JSON.parse(customch);

            //Check Drops Amount...
            if (userdata.customchannel.length === 0) {
                winston.silly(" ");
                winston.info(chalk.gray("No Custom Channels Found..."))
                await createCustomChannel(true)
            }
            winston.silly(" ");
            winston.info(chalk.gray("Found " + userdata.customchannel.length + " Custom Channels..."))
            winston.silly(" ");
            //Ask if user wanna add another ch
            await addanotherone()
            await customCheckLive(true);
            await askCustomChannelStart(false, true)


        } else {
            winston.silly(" ");
            winston.info(chalk.gray("No Custom Channels Found..."))
            await createCustomChannel(false);

            if (userdata.customchannel.length === 0) {
                winston.silly(" ");
                winston.info(chalk.gray("No Custom Channels Created..."))
                winston.silly(" ");
                winston.info(chalk.gray("Closing Bot, No Custom Channels Added!"))
                if (!userdata.settings.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                process.exit(21);
            }
            winston.silly(" ");
            winston.info(chalk.gray("Found " + userdata.customchannel.length + " Custom Channels..."))
            winston.silly(" ");
            //Ask if user wanna add another ch
            await addanotherone()
            await customCheckLive(true);
            await askCustomChannelStart(false, true)
        }

    } else {
        const path = './CustomChannels.json'
        if (fs.existsSync(path)) {
            let customch = fs.readFileSync('./CustomChannels.json', 'utf8');
            userdata.customchannel = JSON.parse(customch);
            //Check Drops Amount...
            if (userdata.customchannel.length === 0) {
                winston.silly(" ");
                winston.info(chalk.gray("No Custom Channels Found..."))
                process.exit(1)
            }
            winston.silly(" ");
            winston.info(chalk.gray("Found " + userdata.customchannel.length + " Custom Channels..."))
            winston.silly(" ");
            //Let the User Select a Starting Ch
            await customCheckLive(true);
            await askCustomChannelStart(true, true)
        } else {
            winston.silly(" ");
            winston.info(chalk.gray("Closing Bot, somehow there is no Customchannels file anymore...!"))
            if (!userdata.settings.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
            process.exit(21);
        }
    }

}

async function addanotherone() {
    //Ask if user wanna add another ch
    await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: 'Do you wanna add a new Custom Channel?',
            },
        ])
        .then(async (answers: {confirmed: boolean}) => {
            if (answers.confirmed) {
                await createCustomChannel(false);
                winston.silly(" ");
                winston.info(chalk.gray("Found " + userdata.customchannel.length + " Custom Channels..."))
                winston.silly(" ");
            }
        })
}

export async function askCustomChannelStart(random: boolean, filterlive: boolean) {
    userdata.availableDropNameChoices = [];
    userdata.customchannel.forEach(channel => {
        if (filterlive) {
            if (channel.live) {
                userdata.availableDropNameChoices.push(channel.Name)
            }
        } else {
            userdata.availableDropNameChoices.push(channel.Name)
        }
    })
    if (userdata.availableDropNameChoices.length === 0) {
        winston.info(chalk.yellow('No Channels life select any to start...'))
        userdata.customchannel.forEach(channel => {userdata.availableDropNameChoices.push(channel.Name)})
    }

    winston.silly(" ")
    if (!random) {
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'namelist',
                    message: 'What Drop do you wanna start Watching?',
                    choices: userdata.availableDropNameChoices,
                },
            ])
            .then(async (answer: {namelist: string}) => {
                userdata.customchannel.forEach(drop => {
                    if (drop.Name === answer.namelist) {
                        userdata.startDrop = drop.TTVLink.split('https://www.twitch.tv/')[1]
                    }
                })
            });
    } else {
        let randomname = userdata.availableDropNameChoices[getRandomInt(userdata.availableDropNameChoices.length)]
        userdata.customchannel.forEach(drop => {
            if (drop.Name === randomname) {
                userdata.startDrop = drop.TTVLink.split('https://www.twitch.tv/')[1]
            }
        })
        winston.info(chalk.gray('Selected a random drop to watch: ' + chalk.white(userdata.startDrop)))
    }
}

async function createCustomChannel(ask: boolean) {
    if (ask) {
        await inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'confirmed',
                    message: 'Do you wanna add a Custom Channel?',
                },
            ])
            .then(async (answers: {confirmed: boolean}) => {
                if (!answers.confirmed) {
                    winston.silly(" ");
                    winston.info(chalk.gray("Closing Bot, No Custom Channels Added!"))
                    if (!userdata.settings.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                    process.exit(21);
                } else {
                    await getCustomDetails()
                }});
    } else {
        await getCustomDetails()
    }
}

async function getCustomDetails() {
    let CustomChannel = {
        Name: '',
        TTVLink: '',
        WatchType: '',
        Time: 0,
        Points: false
    }
    const watch = ["Watch indefinitely", "Watch until time runs out"]
    await inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please provide a Name for this Custom Channel:',
            },
            {
                type: 'input',
                name: 'ttvlink',
                message: 'Please provide the Twitch Url:',
                validate: (value: string) => validURL(value),
            },
            {
                type: 'list',
                name: 'watchoption',
                message: 'How should the channel be watched?',
                choices: watch,
            },
            {
                type: 'confirm',
                name: 'points',
                message: 'Should the Bot also Farm Points?',
            },
        ])
        .then(async (answers: {name: string, ttvlink: string, watchoption: string, points: boolean}) => {
            winston.info(chalk.gray("Setting Name, link and the watch type..."))
            //Set
            CustomChannel.Name = answers.name
            CustomChannel.TTVLink = answers.ttvlink
            CustomChannel.WatchType = answers.watchoption
            CustomChannel.Points = answers.points

            if (answers.watchoption === 'Watch until time runs out') {
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'time',
                        message: 'How many minutes should the channel be watched:',
                    },
                ]).then(async (answers: {time: number}) => {
                    winston.info(chalk.gray("Setting Time..."))
                    CustomChannel.Time = answers.time;
                })
            }
            userdata.customchannel.push(CustomChannel)
            //Save Created CH
            await fs.promises.writeFile('./CustomChannels.json', JSON.stringify(userdata.customchannel, null, 2)).then(function () {
                winston.silly(" ");
                winston.info(chalk.green("Successfully Saved Custom Channels..."))
                winston.silly(" ");
            }).catch(err => {throw err})
        });
}

export async function customCheckLive(feedback: boolean) {
    for (const customchannel of userdata.customchannel) {
        let channelLogin = customchannel.TTVLink.split('https://www.twitch.tv/')[1]
        let status = await TwitchGQL.GetLiveStatus(channelLogin)
        customchannel["live"] = !!status;
        if (feedback) {
            winston.silly(" ")
            winston.info(chalk.cyan(customchannel.TTVLink) + " | " + chalk.magenta(customchannel.Name)+ " | " + statustoString(customchannel.live), {event: "getResult"});
        }
    }
    if (feedback) winston.silly(" ")
}