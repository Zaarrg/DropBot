import winston from "winston";
import chalk from "chalk";
import {userdata} from "../../index" ;
import {Chromepaths} from "../get/getSettings";
import {Login} from "../../Pages/loginPage";
import fs from "fs";
import axios from "axios";
import {retryConfig} from "../../utils/util";
const inquirer = require("inquirer");

let pw: string = '';
let nm: string = '';
export async function login() {
    if (!userdata.auth_token && !fs.existsSync('./twitch-session.json')) {
        if (!userdata.settings.displayless) {
            winston.silly(" ");
            winston.info(chalk.gray('Please Login into your Twitch Account...'))
            winston.silly(" ");

            let options = ["Directly via Command Line", "Via Browser"]
            await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'loginoption',
                        message: 'How would you like to Login into your account?',
                        choices: options,
                    },
                ])
                .then(async (answer: {loginoption: string}) => {
                    if (answer.loginoption === 'Via Browser') {
                        await browserlogin();
                    } else {
                        await directlogin('', '');
                        pw = '';
                        nm = '';
                    }
                });
        } else {
            winston.error('ERROR')
            throw 'No twitch-session.json found to use in displayless mode...'
        }
    } else {
        await getTwitchUserDetails()
        winston.silly(" ");
        winston.info(chalk.gray('Found a twitch-session... No need to login...'))
        winston.silly(" ");
    }


}

async function askforacccountdetails() {
    if (pw === '' || nm === '') {
        await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'username',
                    message: 'What is your Username?'
                },
                {
                    type: 'password',
                    name: 'password',
                    message: 'What is your Password?'
                }
            ])
            .then(async (Answer: {username: string, password: string}) => {
                pw = Answer.password
                nm = Answer.username
            });
        return {pw: pw, nm: nm}
    }
    return {pw: pw, nm: nm}
}

async function askforauthcode(errorcode: number) {
    let message: string = '';
    let input: string = '';
    if (errorcode === 3011) message = 'What is your 2FA token?'
    if (errorcode === 3022) message = 'What is your Email code?'

    await inquirer
        .prompt([
            {
                type: 'input',
                name: 'code',
                message: message
            }
        ])
        .then(async (Answer: {code: string}) => {
            input = Answer.code
        });
    return input
}

async function directlogin(emailcode: string, facode: string, captcha_proof = {}) {
    let attempt = 0;
    const details = await askforacccountdetails()

    let config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
            "Content-type": "text/plain",
        },
        raxConfig: retryConfig
    }
    let body = {
        "client_id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "undelete_user": false,
        "remember_me": true,
        "username": details.nm,
        "password": details.pw,
        ...captcha_proof
    }
    if (emailcode !== '') {
        Object.assign(body, {"twitchguard_code": emailcode})
    } else if (facode !== '') {
        Object.assign(body, {"authy_token": facode})
    }

    await axios.post('https://passport.twitch.tv/login', body, config)
        .then(async function (response) {
            let response_data = response.data
            if (userdata.settings.debug) winston.info('loginresponse %o', JSON.stringify(response_data,null, 2))
            winston.info(chalk.green("Successfully Logged in..."))

            let authcookie = [{
                "name": "auth-token",
                "value": response_data.access_token,
            }]
            await fs.promises.writeFile('twitch-session.json', JSON.stringify(authcookie, null, 2)).then(function () {
                winston.silly(" ");
                winston.info(chalk.green("Successfully Saved Cookies..."))
                winston.silly(" ");
            }).catch(err => {throw err})
            await getTwitchUserDetails();

        })
        .catch(async function (error) {
            winston.silly(" ")
            winston.error(chalk.yellow('Something went wrong...'))
            let errorcode = 0;
            let capta = {}
            try {
                if (error.response.data.captcha_proof) capta = {captcha_proof: error.response.data.captcha_proof}
            } catch (e) {}
            try {
                errorcode = error.response.data.error_code
            } catch (e) {}

            if (attempt === 3) {
                winston.info(chalk.gray('Failed 3 times to login closing...'))
                throw 'Failed to Login...'
            }
            if (errorcode === 1000) {
                nm = '';
                pw = '';
                winston.info(chalk.gray('Login failed due to CAPTCHA...'))
                winston.silly(" ")
                winston.info(chalk.gray('Your login attempt was denied by CAPTCHA. Please wait 12h or login via the browser...'))
                winston.silly(" ")
                winston.info(chalk.gray('Redirecting to browser login...'))
                await browserlogin()
            } else if (errorcode === 3001 || errorcode === 2005) {
                attempt++
                nm = '';
                pw = '';
                winston.info(chalk.gray("Login failed due to incorrect username or password..."))
                await directlogin('', '', capta);
            } else if (errorcode === 3012) {
                attempt++
                winston.info(chalk.gray("Invaild 2FA..."))
                winston.silly(" ")
                let code = await askforauthcode(3011);
                await directlogin('', code, capta);
            } else if (errorcode === 3023) {
                attempt++
                winston.info(chalk.gray("Invaild Email Code..."))
                winston.silly(" ")
                let code = await askforauthcode(3022);
                await directlogin('', code, capta);
            }
            if (errorcode === 3011) {
                winston.info(chalk.gray('2FA token required..."'))
                winston.silly(" ")
                let code = await askforauthcode(3011);
                await directlogin('', code, capta);
            } else if (errorcode === 3022) {
                winston.info(chalk.gray('Email code required...'))
                winston.silly(" ")
                let code = await askforauthcode(3022);
                await directlogin(code, '', capta);
            } else if (!fs.existsSync('./twitch-session.json')) {
                attempt++
                nm = '';
                pw = '';
                winston.info(chalk.gray('Login failed for an unknown reason...'))
                winston.info(chalk.gray('The Reason is probably:'))
                winston.info(chalk.yellow('Error Code: ' + error.data.error_code + ' | Reason: ' + error.data.error + ' | Error Description: ' + error.error_description))
                winston.silly(" ")
                await directlogin('', '', capta);
            }
        })
}

async function browserlogin() {

    winston.info(chalk.gray('Proceeding to Browser...'))
    if (userdata.settings.Chromeexe === '' ) {
        winston.info(chalk.gray('No Browser Found...'))
        await Chromepaths()
        await Login()
        await getTwitchUserDetails()
    } else {
        winston.info(chalk.gray('Browser Found...'))
        await Login()
        await getTwitchUserDetails()
    }

}

async function getTwitchUserDetails() {
    if (userdata.auth_token || fs.existsSync('./twitch-session.json')) {
        if (fs.existsSync('./twitch-session.json')) {
            const data = await fs.promises.readFile('./twitch-session.json', 'utf8')
            let cookiedata = JSON.parse(data);
            for (let i = 0; i < cookiedata.length; i++) {
                if (cookiedata[i].name === 'auth-token') {
                    userdata.auth_token = cookiedata[i].value;
                    break;
                }
            }
        }
        if (userdata.auth_token === "") {
            winston.error('ERROR')
            throw 'Could somehow not find a auth token in your twitch session...'
        }
    } else {
        winston.error('ERROR')
        throw 'Could somehow not find a twitch session...'
    }


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
        })
        .catch(function (error) {
            winston.error(chalk.red('ERROR: Could not validate your auth token...'))
            throw error.response.status + ' ' + error.response.statusText + ' ' + error.response.data.message
        })


}