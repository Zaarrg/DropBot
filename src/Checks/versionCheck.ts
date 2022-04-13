import {retryConfig} from "../utils/util";

const winston = require("winston");
const axios = require("axios");
const chalk = require("chalk");

export default async function (version: string) {

    type Data = {
        data: Object
    }

    const url = 'http://144.91.124.143:3004/ttvdropbot-dev';
    const req = await axios.get(url, {raxConfig: retryConfig}).then((data: Data) => {
            return data.data;
        }).catch((err: any) => {
            winston.error("ERROR: Could not check the version...")
            throw err
    });

    if (req.version !== version) {
        winston.silly(" ")
        winston.info(chalk.green("New Version to download available...") + " | " + chalk.gray("Your Version: ") +  chalk.magenta(version + " (main)") + " | " + chalk.gray("Newest Version: ") +  chalk.magenta(req.version))
    }
}