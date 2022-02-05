const inquirer = require("inquirer");
const data = require("../Data/SavedData")
const chalk = require("chalk");
const fs = require("fs");
const inputReader = require("wait-console-input");
const {SelectStartingCh} = require("./SelectStartingCh");
const {CreateCustomChannel} = require("../functions/CreateCustomChannel")
const winston = require("winston");

async function CustomChannel() {
    if (data.displayless === false) {
    await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: 'Do you wanna watch a Custom Channel?',
            },
        ])
        .then(async (answers) => {
            let CustomAmswers

            CustomAmswers = JSON.stringify(answers, null, '  ');
            CustomAmswers = JSON.parse(CustomAmswers);

            if (CustomAmswers.confirmed === false) {
                data.RustDrops = true;
            } else {
                const path = './CustomChannels.json'
                if (fs.existsSync(path)) {
                    let customch = fs.readFileSync('./CustomChannels.json', 'utf8');
                    data.CustomChannels = JSON.parse(customch);
                    //Check Drops Amount...
                    if (data.CustomChannels.length === 0) {
                        winston.info(" ");
                        winston.info(chalk.gray("No Custom Channels Found..."))
                        await CreateCustomChannel(true).then(r => {
                            if (!r) {
                                winston.info(" ");
                                winston.info(chalk.gray("Closing Bot, No Custom Channels Added!"))
                                data.RustDrops = true;
                                if (!data.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                                process.exit(21);
                            }
                        });
                    }
                    winston.info(" ");
                    winston.info(chalk.gray("Found " + data.CustomChannels.length + " Custom Channels..."))
                    winston.info(" ");
                    //Ask if user wanna add another ch
                    await inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'confirmed',
                                message: 'Do you wanna add a new Custom Channel?',
                            },
                        ])
                        .then(async (answers) => {
                            let CustomA
                            CustomA = JSON.stringify(answers, null, '  ');
                            CustomA = JSON.parse(CustomA);
                            if (CustomA.confirmed === true) {
                                await CreateCustomChannel(false);
                                customch = fs.readFileSync('./CustomChannels.json', 'utf8');
                                winston.info(" ");
                                winston.info(chalk.gray("Found " + data.CustomChannels.length + " Custom Channels..."))
                                winston.info(" ");
                            }

                        })
                    //Let the User Select a Starting Ch
                    await checkstatus(true, true);
                    winston.info(" ")
                    await SelectStartingCh(false);
                    data.CustomChboolean = true;
                } else {
                    winston.info(" ");
                    winston.info(chalk.gray("No Custom Channels Found..."))
                    let customch;
                    await CreateCustomChannel(true);
                    //Check Drops Amount...
                    if (data.CustomChannels.length === 0) {
                        winston.info(" ");
                        winston.info(chalk.gray("No Custom Channels Found..."))
                        await CreateCustomChannel(true).then(r => {
                            if (!r) {
                                winston.info(" ");
                                winston.info(chalk.gray("Closing Bot, No Custom Channels Added!"))
                                data.RustDrops = true;
                                if (!data.displayless) inputReader.wait(chalk.gray("Press any Key to continue..."))
                                process.exit(21);
                            }
                        });
                    }

                    winston.info(" ");
                    winston.info(chalk.gray("Found " + data.CustomChannels.length + " Custom Channels..."))
                    winston.info(" ");
                    //Ask if user wanna add another ch
                    await inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'confirmed',
                                message: 'Do you wanna add another new Custom Channel?',
                            },
                        ])
                        .then(async (answers) => {
                            let CustomA
                            CustomA = JSON.stringify(answers, null, '  ');
                            CustomA = JSON.parse(CustomA);
                            if (CustomA.confirmed === true) {
                                await CreateCustomChannel(false);
                                customch = fs.readFileSync('./CustomChannels.json', 'utf8');
                                winston.info(" ");
                                winston.info(chalk.gray("Found " + data.CustomChannels.length + " Custom Channels..."))
                                winston.info(" ");
                            }

                        })
                    //Let the User Select a Starting Ch
                    await checkstatus(true, true);
                    winston.info(" ")
                    await SelectStartingCh(false);
                    data.CustomChboolean = true;
                }
            }
        });
    } else {
        const path = './CustomChannels.json'
        if (fs.existsSync(path)) {
            let customch = fs.readFileSync('./CustomChannels.json', 'utf8');
            data.CustomChannels = JSON.parse(customch);
            //Check Drops Amount...
            if (data.CustomChannels.length === 0) {
                winston.info(" ");
                winston.info(chalk.gray("No Custom Channels Found..."))
                process.exit(1)
            }
            winston.info(" ");
            winston.info(chalk.gray("Found " + data.CustomChannels.length + " Custom Channels..."))
            winston.info(" ");
            //Let the User Select a Starting Ch
            await checkstatus(true, true);
            winston.info(" ")
            await SelectStartingCh(false);
            data.CustomChboolean = true;
        } else {
            winston.info(" ");
            winston.info(chalk.gray("No Custom Channels File found skipping..."))
        }
    }
}
async function checkstatus(feedback, colors) {
    if (feedback) {
        winston.info(" ");
        winston.info(chalk.gray("Checking Custom Channels Status..."))
    }
    let checkpage = await data.browser.newPage();
    await checkpage.setDefaultTimeout(data.settings.timeout)
    let urls = [];
    let Statuslst = [];
    data.choi = [];

    data.CustomChannels.forEach(item => {
            urls.push(item.TTVLink)
    })
    for (const item of urls) {
        await checkpage.goto(item, {waitUntil: ["networkidle2"]})
        await checkpage.waitForSelector(`[status]`); // default timeout is 30s
        let status = await checkpage.$$eval('[status]', el => el[0].getAttribute('status').includes('live'));
        if (status) {
            data.CustomChannels.forEach(i => {
                function color() {
                    if (colors) {
                        return chalk.green("Online")
                    } else {
                        return "Online"
                    }
                }
                if (i.TTVLink === item) {
                    data.choi.push(i.Name)
                    Statuslst.push({Name: i.Name, TTVLink: item, Status: color()})
                }
            })
        } else if (!status) {
            data.CustomChannels.forEach(i => {
                function color() {
                    if (colors) {
                        return chalk.red("Offline")
                    } else {
                        return "Offline"
                    }
                }
                if (i.TTVLink === item) {
                    data.offlinechs.push(i.Name);
                    data.choi.push(i.Name)
                    Statuslst.push({Name: i.Name, TTVLink: item, Status: color()})
                }
            })
        }
    }
    Statuslst.forEach(el => {
        if (feedback) {
            winston.info(" ")
            winston.info(chalk.cyan(el.TTVLink) + " | " + chalk.magenta(el.Name)+ " | " + el.Status);
        }
    })
    checkpage.close();
    return Statuslst;
}

module.exports = {
    CustomChannel,
    checkstatus
}