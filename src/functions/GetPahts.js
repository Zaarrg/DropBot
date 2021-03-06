const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const data = require("../Data/SavedData")

async function GetPaths() {

    const path = './settings.json'

    if (fs.existsSync(path)) {
        let settingsfile = fs.readFileSync('./settings.json', 'utf8');
        data.settings = JSON.parse(settingsfile);
        if (data.settings[0].pathprovided === false) {
            await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'pathexe',
                        message: 'Please provide your Google Chrome Executable path?',
                    },
                ])
                .then((answers) => {

                    console.log(" ")
                    console.log(chalk.gray("Setting Executable Path..."))
                    data.Executablepath = JSON.stringify(answers, null, '  ');
                    data.Executablepath = JSON.parse(data.Executablepath);

                    data.settings.push({pathexe: data.Executablepath.pathexe, pathprovided: true})

                });

        } else {
            console.log(" ");
            console.log(chalk.gray("Executable Path provided..."))
        }

        if (data.settings[1].datadirprovided === false) {
            data.settings.pop();
            await inquirer
                .prompt([
                    {
                        type: 'confirm',
                        name: 'confirmed',
                        message: 'Do you wanna use a custom UserDataDirectory?',
                    },
                ])
                .then(async (answers) => {

                    data.UserDataDirboolean = JSON.stringify(answers, null, '  ');
                    data.UserDataDirboolean = JSON.parse(data.UserDataDirboolean);

                    if (data.UserDataDirboolean.confirmed === true) {

                        await inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'UserDataPath',
                                    message: 'Please provide your UserDataDirectory?',
                                },
                            ])
                            .then((answers) => {

                                console.log(" ")
                                console.log(chalk.gray("Setting UserData path..."))

                                data.UserDataDir = JSON.stringify(answers, null, '  ');
                                data.UserDataDir = JSON.parse(UserDataDir);


                                data.settings.push({UserDataPath: data.UserDataDir.UserDataPath, datadirprovided: true})

                            });
                    } else {
                        return data.settings.push({UserDataDir: '', datadirprovided: false})
                    }
                });






            await fs.writeFile('settings.json', JSON.stringify(data.settings, null, 2), function(err) {
                if (err) throw err;
                console.log(" ");
                console.log(chalk.green("Successfully Saved Settings..."))
                console.log(" ");
            });
        } else {
            console.log(" ");
            console.log(chalk.gray("UserData Path provided..."))
        }
    } else {
        await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'pathexe',
                    message: 'Please provide your Google Chrome Executable path?',
                },
            ])
            .then((answers) => {

                console.log(" ")
                console.log(chalk.gray("Setting Executable Path..."))
                data.Executablepath = JSON.stringify(answers, null, '  ');
                data.Executablepath = JSON.parse(data.Executablepath);

                data.settings.push({pathexe: data.Executablepath.pathexe, pathprovided: true})

            });


        await inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'confirmed',
                    message: 'Do you wanna use a custom UserDataDirectory?',
                },
            ])
            .then(async (answers) => {

                data.UserDataDirboolean = JSON.stringify(answers, null, '  ');
                data.UserDataDirboolean = JSON.parse(data.UserDataDirboolean);

                if (data.UserDataDirboolean.confirmed === true) {

                    await inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'UserDataPath',
                                message: 'Please provide your UserDataDirectory Name?',
                            },
                        ])
                        .then((answers) => {

                            console.log(" ")
                            console.log(chalk.gray("Setting UserData path..."))

                            data.UserDataDir = JSON.stringify(answers, null, '  ');
                            data.UserDataDir = JSON.parse(data.UserDataDir);

                            data.settings.push({UserDataPath: data.UserDataDir.UserDataPath, datadirprovided: true})

                        });
                } else {
                    return data.settings.push({UserDataDir: '', datadirprovided: false})
                }
            });


        await fs.writeFile('settings.json', JSON.stringify(data.settings, null, 2), function(err) {
            if (err) throw err;
            console.log(" ");
            console.log(chalk.green("Successfully Saved Settings..."))
            console.log(" ");
        });
    }
}

module.exports = {
    GetPaths
}