export const version = "2.0.0.3";
import {userdataclass} from "./Data/userdata";
export let userdata = new userdataclass();
import chalk from "chalk";
import CheckVersion from "./checks/versionCheck"
import GetSettings, {logimportantvalues} from "./functions/get/getSettings"
import GetWatchOption from "./functions/get/getWatchOption"
import {askWhatDropToStart, askWhatGameToWatch, getTwitchDrops} from "./functions/get/getTwitchDrops"
import {startWatching} from "./functions/startWatching";
import {login} from "./functions/login/defaultlogin";
import fs from "fs";
import {getCustomChannel} from "./functions/get/getCustomChannel";
import {CustomEventHandlerStart} from "./functions/handler/custompageHandler";
import {validateAuthToken} from "./checks/validateAuthToken";
import {matchArgs, setArgs} from "./functions/get/getArgs";
import * as rax from 'retry-axios';
import {retryConfig} from "./utils/util";
const winston = require('winston');
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();

(async () => {
    //Get Settings
    await setArgs();
    await GetSettings();
    await matchArgs();
    await setRetries();
    await logimportantvalues()
    await CheckVersion(version)
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

async function setRetries() {
    await TwitchGQL.SetRetryTimeout(userdata.settings.RetryDelay).then(() => {
        retryConfig.retryDelay = userdata.settings.RetryDelay;
        rax.attach();
    })
}