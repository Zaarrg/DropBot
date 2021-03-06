const inquirer = require("inquirer");
const data = require("../Data/SavedData")
const chalk = require("chalk");
const {CheckForLiveChannels} = require("../Checks/CheckForLiveChannels")


async function SelectStartingCh() {
    //Check for Live Channels and add them to List
    await CheckForLiveChannels();

    await inquirer
        .prompt([
            {
                type: 'list',
                name: 'Channel',
                message: 'Select Twitch Channel to start Watching?',
                choices: data.choi,
            },
        ])
        .then((answers) => {

            console.log(" ")
            console.log(chalk.gray("Setting Starting Channel..."))
            data.Startingchannel = JSON.stringify(answers, null, '  ');
            data.Startingchannel = JSON.parse(data.Startingchannel);
        });
}

module.exports = {
    SelectStartingCh
}