import {version} from "../../index";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers'
import {userdata} from "../../index" ;

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
        .option("waitforchannels", {
            alias: "waitonline",
            describe: "Disable waitforchannels, forcing the bot to not wait for other channels with drops instead switch the game.",
            type: "boolean",
            nargs: 0,
        })
        .option("autoclaim", {
            describe: "Enable autoclaim.",
            type: "boolean",
            nargs: 0,
        })
        .option("log", {
            describe: "Enable logging to file.",
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
    if (args.chrome !== undefined) userdata.settings.Chromeexe = args.chrome
    if (args.userdata!==undefined) userdata.settings.UserDataPath = args.userdata
    if (args.webhook!==undefined) userdata.settings.WebHookURL = args.webhook
    if (args.interval!==undefined) userdata.settings.ProgressCheckInterval = args.interval
    if (args.games!==undefined) userdata.settings.Prioritylist = args.games
    if (args.debug!==undefined) userdata.settings.debug = args.debug
    if (args.displayless!==undefined) userdata.settings.displayless = args.displayless
    if (args.waitforchannels!==undefined) userdata.settings.WaitforChannels = !args.waitforchannels
    if (args.autoclaim!==undefined) userdata.settings.AutoClaim = args.autoclaim
    if (args.log!==undefined) userdata.settings.LogToFile = args.log
    if (args.retryinterval!==undefined) userdata.settings.RetryDelay = args.retryinterval
    if (args.webhookevents!==undefined) userdata.settings.WebHookEvents = args.webhookevents
}

