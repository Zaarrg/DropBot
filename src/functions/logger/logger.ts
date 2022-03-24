import axiosRetry from "axios-retry";
import axios from "axios";
import chalk from "chalk";
import {delay} from "../../utils/util";

const fs = require("fs");
const winston = require('winston');
const {format} = require("winston");
const { printf } = format;

export default async function () {

    type Log = {
        message: string,
        level: string,
        timestamp: string
    }

    const fileFormat = printf((log: Log) => {return `${log.timestamp}: ${log.message}`});
    const consoleFormat = printf((log: Log) => {return log.message})
    // Logger configuration
    process.on('unhandledRejection', async (reason, promise) => {
            winston.error(reason)
            winston.info('ERROR: Closing in 30 seconds...')
            await delay(30000)
            process.exit(21);
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

    //Set Retries
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount, error) => {
            winston.info(chalk.yellow('Failed axios Request... Retrying in 30 seconds... Try: ' + retryCount + "/3 " + error));
            return 30000; // time interval between retries
        }
    });
}

async function createConsoleLogger(consoleFormat: any) {
    winston.add(new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        RejectionHandler: true,
        format: format.combine(
            format.prettyPrint(),
            format.splat(),
            consoleFormat
        )
    }));
}


async function createFilelogger(fileFormat:any) {

    winston.add(new winston.transports.File({
        filename: './TTVDropBot-out.log',
        level: 'info',
        handleExceptions: true,
        RejectionHandler: true,
        maxsize: 10242880,
        maxFiles: 10,
        timestamp: true,
        format: format.combine(
            format.uncolorize(),
            format.splat(),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            fileFormat,
        )
    }));
    winston.add(new winston.transports.File({
        filename: './TTVDropBot-error.log',
        level: 'error',
        handleExceptions: true,
        RejectionHandler: true,
        maxsize: 10242880,
        maxFiles: 10,
        timestamp: true,
        format: format.combine(
            format.uncolorize(),
            format.splat(),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            fileFormat,
        )
    }));




}
