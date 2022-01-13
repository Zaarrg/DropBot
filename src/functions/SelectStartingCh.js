const inquirer = require("inquirer");
const data = require("../Data/SavedData")
const chalk = require("chalk");
const {CheckForLiveChannels} = require("../Checks/CheckForLiveChannels")
const {getRandomInt} = require("../functions/util");


async function SelectStartingCh(CheckLive) {
    //Check for Live Channels and add them to List
    if (CheckLive === true) {
        data.choi = [];
        await CheckForLiveChannels();
    }

    if (!data.displayless) {
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'Channel',
                    message: 'Select Twitch Channel to start Watching?',
                    choices: data.choi,
                },
            ])
            .then(async (answers) => {

                console.log(" ")
                console.log(chalk.gray("Setting Starting Channel..."))
                data.Startingchannel = JSON.stringify(answers, null, '  ');
                data.Startingchannel = JSON.parse(data.Startingchannel);
                data.Startingchannel = data.Startingchannel.Channel

                if(data.offlinechs.includes(data.Startingchannel)) {

                    await inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'confirmed',
                                message: 'This Channel is Offline, are you sure you wanna continue anyways?',
                            },
                        ])
                        .then(async (answers) => {

                            let awnser = JSON.stringify(answers, null, '  ');
                            awnser = JSON.parse(awnser);

                            if (!awnser.confirmed) {
                                await SelectStartingCh();
                            }

                        });


                }



            });
    } else {
        data.Startingchannel = data.choi[getRandomInt(data.choi.length)]
        console.log(chalk.gray('\nSelected as starting Channel: ' + data.Startingchannel))
    }
}

module.exports = {
    SelectStartingCh
}