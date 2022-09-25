import {version} from "../../index";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers'
import {userdata} from "../../index" ;
import fs from "fs";
import winston from "winston";
import chalk from "chalk";

export async function setArgs() {

    await yargs(hideBin(process.argv))
        .scriptName("./TTVDropBot or index.js")
        .usage("Usage: $0 --arg...")
        .version(version)
        .option("chrome", {
            alias: "c",
            describe: "The path to your Chrome executable.",
            type: "string",
            nargs: 1,
        })
        .example(
            "--chrome C:path:to:chrome.exe",
            "Sets your chrome path.",
        )
        .option("userdata", {
            alias: "u",
            describe: "The path to your userdata folder location.",
            type: "string",
            nargs: 1,
        })
        .example(
            "--userdata C:path:to:userdata-folder",
            "Sets your userdata path.",
        )
        .option("webhook", {
            alias: "wh",
            describe: "The Discord Webhook URL.",
            type: "string",
            nargs: 1,
        })
        .example(
            "--webhook https:discord.com:api:webh....",
            "Sets your webhook url.",
        )
        .option("webhookevents", {
            describe: "Set what events should be send via webhook.",
            type: "array"
        })
        .example(
            "--webhookevents requestretry claim newdrop offline newgame get getresult progress start error warn info",
            "Defaults to the events in this example provided.",
        )
        .option("interval", {
            alias: "i",
            describe: "The progress interval in ms.",
            type: "number",
            nargs: 1,
        })
        .example(
            "--interval 30000",
            "Sets the progress interval to 30s.",
        )
        .option("retryinterval", {
            alias: "retry",
            describe: "The retry interval in ms.",
            type: "number",
            nargs: 1,
        })
        .example(
            "--retryinterval 30000",
            "Sets the retry interval to 30s.",
        )
        .option("games", {
            alias: "g",
            describe: "The Games the bot should watch.",
            type: "array"
        })
        .example(
            "--games Rust Krunker 'Elite: Dangerous' ",
            "Sets the Prioritylist to Rust, Krunker and Elite: Dangerous.",
        )
        .option("token", {
            describe: "Your twitch auth_token.",
            type: "string"
        })
        .example(
            "--token yourkindalongtoken ",
            "Sets the your current twitch auth token, overwriting any in twitch-session.json.",
        )
        .option("showtoken", {
            describe: "Show your auth_token after login.",
            type: "boolean",
            nargs: 0,
        })
        .option("debug", {
            alias: "d",
            describe: "Enable Debug logging.",
            type: "boolean",
            nargs: 0,
        })
        .option("displayless", {
            alias: "dl",
            describe: "Enable Displayless mode.",
            type: "boolean",
            nargs: 0,
        })
        .option("forcecustomchannel", {
            describe: "Force Custom Channels. Only useful for display-less mode.",
            type: "boolean",
            nargs: 0,
        })
        .option("waitforchannels", {
            alias: "waitonline",
            describe: "Disable waitforchannels, forcing the bot to not wait for other channels with drops instead switch the game.",
            type: "boolean",
            nargs: 0,
        })
        .option("autoclaim", {
            describe: "Enable autoclaim for drops.",
            type: "boolean",
            nargs: 0,
        })
        .option("autopoints", {
            describe: "Enable auto points for channels.",
            type: "boolean",
            nargs: 0,
        })
        .option("log", {
            describe: "Enable logging to file.",
            type: "boolean",
            nargs: 0,
        })
        .option("usekeepalive", {
            describe: "Enable Express KeepAlive.",
            type: "boolean",
            nargs: 0,
        })
        .option("tray", {
            describe: "Start app in the tray.",
            type: "boolean",
            nargs: 0,
        })
        .describe("help", "Show help.") // Override --help usage message.
        .describe("version", "Show version number.") // Override --version usage message.
        .epilog("TTVDropBot made possible by Zarg");


}

export async function matchArgs() {
    const args : any = yargs.argv
    if (args.chrome !== undefined) userdata.settings.Chromeexe = args.chrome;
    if (args.userdata!==undefined) userdata.settings.UserDataPath = args.userdata
    if (args.webhook!==undefined) userdata.settings.WebHookURL = args.webhook
    if (args.interval!==undefined) userdata.settings.ProgressCheckInterval = args.interval
    if (args.games!==undefined) userdata.settings.Prioritylist = args.games
    if (args.debug!==undefined) userdata.settings.debug = args.debug
    if (args.displayless!==undefined) userdata.settings.displayless = args.displayless
    if (args.forcecustomchannel!==undefined) userdata.settings.ForceCustomChannel = args.forcecustomchannel
    if (args.waitforchannels!==undefined) userdata.settings.WaitforChannels = args.waitforchannels
    if (args.autoclaim!==undefined) userdata.settings.AutoClaim = args.autoclaim
    if (args.autopoints!==undefined) userdata.settings.AutoPoints = args.autopoints
    if (args.log!==undefined) userdata.settings.LogToFile = args.log
    if (args.usekeepalive!==undefined) userdata.settings.UseKeepAlive = args.usekeepalive
    if (args.retryinterval!==undefined) userdata.settings.RetryDelay = args.retryinterval
    if (args.webhookevents!==undefined) userdata.settings.WebHookEvents = args.webhookevents
    if (args.showtoken!==undefined) userdata.showtoken = args.showtoken
    if (args.token !== undefined) userdata.auth_token = args.token

    if (process.env.ttvdropbot_chrome !== undefined) userdata.settings.Chromeexe = process.env.ttvdropbot_chrome;
    if (process.env.ttvdropbot_userdata!==undefined) userdata.settings.UserDataPath = process.env.ttvdropbot_userdata
    if (process.env.ttvdropbot_webhook!==undefined) userdata.settings.WebHookURL = process.env.ttvdropbot_webhook
    if (process.env.ttvdropbot_interval!==undefined) userdata.settings.ProgressCheckInterval = parseInt(process.env.ttvdropbot_interval)
    if (process.env.ttvdropbot_games!==undefined) {
        let stringarray = process.env.ttvdropbot_games.split(' ')
        let replacedarray = stringarray.map(game => game.replace(/_/g, ' '));
        userdata.settings.Prioritylist = replacedarray;
    }
    if (process.env.ttvdropbot_forcecustomchannel!==undefined) userdata.settings.ForceCustomChannel = JSON.parse(process.env.ttvdropbot_forcecustomchannel);
    if (process.env.ttvdropbot_debug!==undefined) userdata.settings.debug = JSON.parse(process.env.ttvdropbot_debug);
    if (process.env.ttvdropbot_displayless!==undefined) userdata.settings.displayless = JSON.parse(process.env.ttvdropbot_displayless)
    if (process.env.ttvdropbot_waitforchannels!==undefined) userdata.settings.WaitforChannels = JSON.parse(process.env.ttvdropbot_waitforchannels)
    if (process.env.ttvdropbot_autoclaim!==undefined) userdata.settings.AutoClaim = JSON.parse(process.env.ttvdropbot_autoclaim)
    if (process.env.ttvdropbot_autopoints!==undefined) userdata.settings.AutoPoints = JSON.parse(process.env.ttvdropbot_autopoints)
    if (process.env.ttvdropbot_log!==undefined) userdata.settings.LogToFile = JSON.parse(process.env.ttvdropbot_log)
    if (process.env.ttvdropbot_usekeepalive!==undefined) userdata.settings.UseKeepAlive = JSON.parse(process.env.ttvdropbot_usekeepalive)
    if (process.env.ttvdropbot_retryinterval!==undefined) userdata.settings.RetryDelay = parseInt(process.env.ttvdropbot_retryinterval)
    if (process.env.ttvdropbot_webhookevents!==undefined) userdata.settings.WebHookEvents = process.env.ttvdropbot_webhookevents.split(' ')
    if (process.env.ttvdropbot_showtoken !== undefined) userdata.showtoken = JSON.parse(process.env.ttvdropbot_showtoken)
    if (process.env.ttvdropbot_token !== undefined) userdata.auth_token = process.env.ttvdropbot_token

}

