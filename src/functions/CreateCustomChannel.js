const inquirer = require("inquirer");
const data = require("../Data/SavedData")
const chalk = require("chalk");
const fs = require("fs");
const {validURL} = require("./util");


async function CreateCustomChannel(ask) {

    if (ask === true) {
        await inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'confirmed',
                    message: 'Do you wanna add a Custom Channel?',
                },
            ])
            .then(async (answers) => {

                data.CustomChannel = JSON.stringify(answers, null, '  ');
                data.CustomChannel = JSON.parse(data.CustomChannel);

                if (data.CustomChannel.confirmed === false) {
                    return false;
                } else {
                    await getCustomDetails()
                }
            });
    } else {
        await getCustomDetails();
    }
        async function getCustomDetails() {

            let name;
            let ttvlink;
            let watchstatus;
            let time = -1;
            let points;

            const watch = ["Changed", "Time"]

            //Name of CH
            await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'Name',
                        message: 'Please provide a Name for this Custom Channel:',
                    },
                ])
                .then(async (answers) => {

                    console.log(chalk.gray("Setting Name..."))
                    name = JSON.stringify(answers, null, '  ');
                    name = JSON.parse(name);
                    name = name.Name;
                });

            //Link of CH
            await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'ttvlink',
                        message: 'Please provide the Twitch Url:',
                        validate: (value) => validURL(value),
                    },
                ])
                .then(async (answers) => {

                    console.log(chalk.gray("Setting TTV URL..."))
                    ttvlink = JSON.stringify(answers, null, '  ');
                    ttvlink = JSON.parse(ttvlink);
                    ttvlink = ttvlink.ttvlink;
                });

            //How to Watch the CH
            await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'watching',
                        message: 'Should this Channel be watched until changed or a specific amount of time?',
                        choices: watch,
                    },
                ])
                .then(async (answers) => {

                    console.log(" ")
                    console.log(chalk.gray("Setting Watch Type..."))
                    watchstatus = JSON.stringify(answers, null, '  ');
                    watchstatus = JSON.parse(watchstatus);

                    if (watchstatus.watching === "Changed") {
                        watchstatus = "Changed";
                    } else {

                        watchstatus = "Time";
                        //How long to Watch CH
                        await inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'time',
                                    message: 'How many minutes should the channel be watched:',
                                },
                            ])
                            .then(async (answers) => {

                                console.log(chalk.gray("Setting Time..."))
                                time = JSON.stringify(answers, null, '  ');
                                time = JSON.parse(time);
                                time = time.time;
                            });
                    }
                });

            //Points Farm
            await inquirer
                .prompt([
                    {
                        type: 'confirm',
                        name: 'confirmed',
                        message: 'Should the Bot also Farm Points?',
                    },
                ])
                .then(async (answers) => {

                    data.Points = JSON.stringify(answers, null, '  ');
                    data.Points = JSON.parse(data.Points);

                    points = data.Points.confirmed;
                });

            //Set the Data
            data.CustomChannels.push({Name: name, TTVLink: ttvlink, WatchType: watchstatus, Time: time, Points: points})

            //Save Created CH
            await fs.writeFile('CustomChannels.json', JSON.stringify(data.CustomChannels, null, 2), function(err) {
                if (err) throw err;
                console.log(" ");
                console.log(chalk.green("Successfully Saved Custom Channels..."))
                console.log(" ");
            });
        }
}

module.exports = {
    CreateCustomChannel
}