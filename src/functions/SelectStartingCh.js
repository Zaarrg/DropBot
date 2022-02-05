const inquirer = require("inquirer");
const data = require("../Data/SavedData")
const chalk = require("chalk");
const {CheckForLiveChannels} = require("../Checks/CheckForLiveChannels")


async function SelectStartingCh(CheckLive) {
    //Check for Live Channels and add them to List
    if (CheckLive === true) {
        data.choi = [];
        await CheckForLiveChannels();
    }

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

            if(data.offlinechs.includes(data.Startingchannel.Channel)) {

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
}

module.exports = {
    SelectStartingCh
}