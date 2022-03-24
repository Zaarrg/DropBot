import {userdata} from "../data/userdata";
import axios from "axios";
import winston from "winston";
import chalk from "chalk";

export async function validateAuthToken() {
    let auth = 'OAuth ' + userdata.auth_token
    let head = {
        Authorization: auth
    }
    await axios.get('https://id.twitch.tv/oauth2/validate', {headers: head})
        .then(function (response){
            let response_data = response.data
            userdata.userid = response_data.client_id
            userdata.clientid = response_data.client_id
        })
        .catch(function (error) {
            winston.error(chalk.red('ERROR: Could not validate your auth token...'))
            throw error.response.status + ' ' + error.response.statusText + ' ' + error.response.data.message
        })

}