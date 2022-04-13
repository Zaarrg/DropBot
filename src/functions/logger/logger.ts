import {sendWebhook, webhookHandler} from "../handler/webHookHandler";
import {userdata} from "../../index" ;

const fs = require("fs");
const winston = require('winston');
const {format} = require("winston");
const { printf } = format;

export default async function () {

    const fileFormat = printf((log: Log) => {return `${log.timestamp}: ${log.message}`});
    const consoleFormat = printf((log: Log) => {return log.message})
    // Logger configuration
    process.on('unhandledRejection', async (reason : string, promise) => {
            winston.error("Unhandled Rejection at: %o", promise)
            winston.error("Unhandled Rejection Reason: " + reason)
        if (userdata.settings.WebHookURL !== "") {
            await sendWebhook([reason, "More Details can be found in the error Log...", "Closing Bot..."], "ERROR", userdata.settings.WebHookURL, 16711680).then((request) => {
                if (!request) {
                    winston.info('Could not send Webhook with ERROR: Closing Bot...')
                    process.exit(21);
                } else {
                    process.exit(21);
                }
            })
        } else {
            process.exit(21);
        }
    })
    try {
        await createConsoleLogger(consoleFormat)
        if (fs.existsSync('./settings.json')) {
            let settingsfile = fs.readFileSync('./settings.json', 'utf8');
            let options = await JSON.parse(settingsfile)
            if (options.LogToFile) {
                await createFilelogger(fileFormat)
            }
        }
    } catch (e) {
        await createConsoleLogger(consoleFormat)
        await createFilelogger(fileFormat)
        winston.error('ERROR')
        throw 'Invalid/Corrupted JSON file...'
    }
    return true
}

async function createConsoleLogger(consoleFormat: any) {
    const consoleLogger = new winston.transports.Console({
        level: 'silly',
        handleExceptions: true,
        RejectionHandler: true,
        format: format.combine(
            format.prettyPrint(),
            format.splat(),
            consoleFormat
        )
    })
    winston.add(consoleLogger);
    consoleLogger.on('logged', async function (log:any) {if (userdata.settings.WebHookURL !== "") await webhookHandler(log)})
}

async function createFilelogger(fileFormat:any) {
    winston.add(new winston.transports.File({
        filename: './logs/TTVDropBot-out.log',
        level: 'info',
        handleExceptions: true,
        RejectionHandler: true,
        maxsize: "20m",
        maxFiles: 5,
        timestamp: true,
        format: format.combine(
            format.uncolorize(),
            format.splat(),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            fileFormat,
        )
    }));
    winston.add(new winston.transports.File({
        filename: './logs/TTVDropBot-error.log',
        level: 'error',
        handleExceptions: true,
        RejectionHandler: true,
        maxsize: "20m",
        maxFiles: 5,
        timestamp: true,
        format: format.combine(
            format.uncolorize(),
            format.splat(),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            fileFormat,
        )
    }));
}

export type Log = {
    message: string,
    event?: string,
    level: string,
    timestamp: string
}