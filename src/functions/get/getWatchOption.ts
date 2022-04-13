import {userdata} from "../../index" ;

const inquirer = require("inquirer");


export default async function () {
    type Watch_Answer = {
        watchoptions: string
    }
    if (!userdata.settings.displayless) {
        let options = ["Twitch Drops", "Custom Channels"]
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'watchoptions',
                    message: 'What do u wanna watch?',
                    choices: options,
                },
            ])
            .then(async (answer: Watch_Answer) => {
                userdata.watch_option = answer.watchoptions
            });
        return userdata.watch_option
    } else {
        userdata.watch_option = "Twitch Drops"
    }

}