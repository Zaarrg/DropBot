export const version = "2.0.0.4";
import {userdataclass} from "./Data/userdata";
export let userdata = new userdataclass();
import chalk from "chalk";
import CheckVersion from "./Checks/versionCheck"
import GetSettings, {logimportantvalues} from "./functions/get/getSettings"
import GetWatchOption from "./functions/get/getWatchOption"
import {askWhatDropToStart, askWhatGameToWatch, getDrops} from "./functions/get/getDrops"
import {startWatching} from "./functions/startWatching";
import {login} from "./functions/login/defaultlogin";
import fs from "fs";
import {getCustomChannel} from "./functions/get/getCustomChannel";
import {CustomEventHandlerStart} from "./functions/handler/custompageHandler";
import {validateAuthToken} from "./Checks/validateAuthToken";
import {matchArgs, setArgs} from "./functions/get/getArgs";
import * as rax from 'retry-axios';
import {retryConfig} from "./utils/util";
const winston = require('winston');
const GQL = require("@zaarrg/gql-dropbot").Init();

(async () => {
    //Get Settings
    await setArgs();
    await GetSettings();
    await matchArgs();
    await setRetries();
    await logimportantvalues()
    await CheckVersion(version)
    //Http Keep Alive
    if (userdata.settings.UseKeepAlive) keepAlive();
    //Login
    await login()
    //Validate
    await validateAuthToken()
    //Get Watch Option
    if (!userdata.settings.displayless) {
        await GetWatchOption()
        await watchoptionSwitch()
    } else {
        if (userdata.settings.ForceCustomChannel) {
            if (fs.existsSync('./CustomChannels.json')) {
                userdata.watch_option = 'Custom Channels'
            } else {
                winston.warn(chalk.yellow('Cant force custom channels without a CustomChannels.json'))
                userdata.watch_option = 'Drops'
            }
        } else {
            userdata.watch_option = 'Drops'
        }
        await watchoptionSwitch()
    }
    winston.info(chalk.gray('Idle!'))
})();


async function watchoptionSwitch() {
    switch (userdata.watch_option) {
        case "Drops":
            //What Drops
            await askWhatGameToWatch(false)
            //Get The Drops of the Game
            await getDrops(userdata.game, true)
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
    await GQL.SetRetryTimeout(userdata.settings.RetryDelay).then(() => {
        retryConfig.retryDelay = userdata.settings.RetryDelay;
        rax.attach();
    })
}

function keepAlive(port = process.env.PORT) {
    const express = require('express');
    const app = express()
    app.get("/", (req: any, res: any) => res.send("DropBot is alive"))
    app.listen(port, () => winston.info(`App listening on port ${port || 0}`))
}