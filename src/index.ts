import chalk from "chalk";
import init_logger from "./functions/logger/logger"
import CheckVersion from "./checks/versionCheck"
import GetSettings from "./functions/get/getSettings"
import GetWatchOption from "./functions/get/getWatchOption"
import {askWhatDropToStart, askWhatGameToWatch, getTwitchDrops} from "./functions/get/getTwitchDrops"
import { userdata } from "./data/userdata";
import {startWatching} from "./functions/startWatching";
import {login} from "./functions/login/defaultlogin";
import fs from "fs";
import {getCustomChannel} from "./functions/get/getCustomChannel";
import {CustomEventHandlerStart} from "./functions/handler/custompageHandler";
import {validateAuthToken} from "./checks/validateAuthToken";

const winston = require('winston');

(async () => {

    await init_logger()
    await CheckVersion("2.0.0.1")

    //Get Settings
    await GetSettings()
    //Login
    await login()
    //Validate
    await validateAuthToken()
    //Get Watch Option
    if (!userdata.settings.displayless) {
        await GetWatchOption()
        await watchoptionSwitch()
    } else {
        if (fs.existsSync('./CustomChannels.json')) {
            userdata.watch_option = 'Custom Channels'
        } else {
            userdata.watch_option = 'Twitch Drops'
        }
        await watchoptionSwitch()
    }


    winston.info(chalk.gray('Idle!'))
    

})();


async function watchoptionSwitch() {
    switch (userdata.watch_option) {
        case "Twitch Drops":
            //What Twitch Drops
            await askWhatGameToWatch(false)
            //Get The Drops of the Game
            await getTwitchDrops(userdata.game, true)
            if (userdata.settings.displayless) {
                await askWhatDropToStart(true, true, true, false)
            } else {
                await askWhatDropToStart(false, true, true, false)}
            await startWatching()
            break;
        case "Custom Channels":
            await getCustomChannel()
            await CustomEventHandlerStart(userdata.startDrop)
            break;
    }
}
