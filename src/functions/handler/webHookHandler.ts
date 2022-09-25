import axios from "axios";
import {Log} from "../logger/logger";
import {userdata} from "../../index";

//events: requestRetry, claim, newDrop, offline, newGame, get, getResult, progress, start, progressEnd, error, warn, info

let logqueue: Log[] = []

export async function webhookHandler(log: Log) {
    //Remove Color Codes
    log.message = log.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').replace(/,/g, ' ');
    if (!log.event) {
        log["event"] = log.level;
    }

        if (log.event === "progressEnd" || log.message !== " ") {
            await webhooklogic(log)
        }

}

async function webhooklogic(log: Log) {
    logqueue.push(log)
        if ((logqueue.length > 1 && logqueue[logqueue.length - 1].event !== logqueue[logqueue.length - 2].event)) {
            if (userdata.settings.WebHookEvents.length > 0 && userdata.settings.WebHookEvents.includes(logqueue[logqueue.length - 2].event!.toLowerCase())) {
                await clearqueueandsend(log)
            } else if (userdata.settings.WebHookEvents.length === 0) {
                await clearqueueandsend(log)
            } else {
                logqueue.splice(0, logqueue.length - 1)
            }
        }
}

async function clearqueueandsend(log: Log) {
    let arraytosend = logqueue.splice(0, logqueue.length - 1)
    let stringarray: string[] = []
    arraytosend.forEach(log => stringarray.push(log.message))

    await sendWebhook(stringarray, arraytosend[0].event!.toString(), userdata.settings.WebHookURL, 8933352).then(status => {
        if (!status) {
            throw "Error while trying to send the discord webhook"
        }
    })

    if (log.event === "progressEnd") logqueue = [];
}


//
export async function sendWebhook(msg: string[], event: string, webhookurl: string, color: number) {
    let content = "";
    let currentDrop = "";
    if (userdata.startDrop !== undefined) {
        currentDrop = userdata.startDrop === "" ? "none" : userdata.startDrop.toString();
    } else {
        currentDrop = "none"
    }
    if (event === "progress") {
        let convertedProgress = await convertProgressString(msg)
        content = convertedProgress.toString().split(",").join("\n")
    } else {
        content = msg.toString().split(",").join("\n\n")
    }

    let config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
            'Content-type': 'application/json'
        }
    }

    let embed = {
        username: "TTVDropBot",
        avatar_url: "https://i.imgur.com/2WtgNe4.png",
        embeds: [
            {
                "author": {
                    "name": "TTVDropBot📜",
                    "url": "https://github.com/PockySweet/TTVDropBot-Fix",
                    "icon_url": "https://i.imgur.com/2WtgNe4.png"
                },
                "fields": [
                    {
                        "name": "Event",
                        "value": event,
                        "inline": true
                    },
                    {
                        "name": "Current Drop",
                        "value": currentDrop,
                        "inline": true
                    },
                ],
                "color": color,
                "description": "```" + content + "```",
                "footer": {
                    "text": "Send directly from TTVDropbot made by Zarg!"
                },
                "timestamp": new Date()
            }
        ]
    }

     return await axios.post(webhookurl, JSON.stringify(embed), config).then(() => {return true}).catch(e => {
         return false
     })
}


async function convertProgressString(stringarray: string[]) {
    let finallog: string[] = [];
    stringarray.forEach(log => {
        let splitted = log.split(" | ")

        let firsttwo = splitted.slice(0, 2)
        let rest = splitted.slice(2, splitted.length)

        if (rest.length === 0) {
            finallog.push(firsttwo.toString().replace(/,/g, ' | ') + "\n")
        } else {
            if (firsttwo.length > 0) finallog.push(firsttwo.toString().replace(/,/g, ' | '))
            if (rest.length > 0) finallog.push(rest.toString().replace(/,/g, ' | ') + "\n")
        }
    })
    return finallog
}
