import {userdata} from "../index" ;
import axios from "axios";
import winston from "winston";
import chalk from "chalk";
import {retryConfig} from "../utils/util";

export async function validateAuthToken() {
    let auth = 'OAuth ' + userdata.auth_token
    let head = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
        Authorization: auth
    }
    await axios.get('https://id.twitch.tv/oauth2/validate', {headers: head, raxConfig: retryConfig})
        .then(function (response){
            let response_data = response.data
            userdata.userid = response_data.user_id
            userdata.clientid = response_data.client_id
            if (userdata.showtoken) winston.info(chalk.yellow('Warning: Your Token is revealed, please only reveal if necessary...'))
            if (userdata.showtoken) winston.info(chalk.yellow('Your Auth Token: ' + chalk.white(userdata.auth_token)))
        })
        .catch(function (error) {
            winston.error(chalk.red('ERROR: Could not validate your auth token...'))
            throw error.response.status + ' ' + error.response.statusText + ' ' + error.response.data.message
        })

}