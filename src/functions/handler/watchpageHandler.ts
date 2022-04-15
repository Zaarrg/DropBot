import {getTwitchDrops} from "../get/getTwitchDrops";
import {userdata} from "../../index" ;
import {allOfflineCheck, liveCheck} from "../../Checks/liveCheck";
import winston from "winston";
import {getCurrentDrop} from "../get/getCurrentDrop";
import {delay, minutestoPercent, retryConfig} from "../../utils/util";
import {dateCheck} from "../../Checks/dateCheck";
import axios from "axios";
import {claimableCheck} from "../../Checks/claimCheck";
import chalk from "chalk";
import {SamePercentCheck} from "../../Checks/samepercentCheck";
import {pointsCheck} from "../../Checks/pointsCheck";
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init(userdata.clientid);
const {Base64} = require('js-base64');

let status:string = 'stopped';

export async function WatchingEventHandlerStart(DropcurrentlyWatching: string) {
    if (status === 'stopped') {
        await getTwitchDrops(userdata.game, false)
        await allOfflineCheck()
        await liveCheck(DropcurrentlyWatching, false);
        await sendMinuteWatched(DropcurrentlyWatching.toString().toLowerCase())
        status = 'running'
        await loop(DropcurrentlyWatching);
    } else if (status === 'running') {
        await loop(DropcurrentlyWatching);
    }
}

async function loop(DropcurrentlyWatching: string) {
    await delay(userdata.settings.ProgressCheckInterval);
    if (userdata.settings.debug) winston.info('UserDATA %o', JSON.stringify(userdata,null, 2))
    //Update Drop Data
    await getTwitchDrops(userdata.game, false)
    await allOfflineCheck()
    //Get the right Drop
    if (status === 'running') {
        await getCurrentDrop().then(async (CurrentDrop) => {
            if (userdata.settings.debug) winston.info('CurrentDrop %o', JSON.stringify(CurrentDrop,null, 2))
            //Switch DropcurrentlyWatching to a live one if current offline and new live ch available
            if (!CurrentDrop.foundlivech.includes(DropcurrentlyWatching) && CurrentDrop.foundlivech.length > 0) {
                DropcurrentlyWatching = CurrentDrop.foundlivech[0]
                winston.info(chalk.gray("Switched current Channel to " + chalk.white(DropcurrentlyWatching) + "..."))
                winston.silly(" ")
            }
            await liveCheck(DropcurrentlyWatching, false);
            await claimableCheck(CurrentDrop, userdata.settings.AutoClaim, false)
            await dateCheck(CurrentDrop, false)
            await SamePercentCheck(CurrentDrop)
            await pointsCheck(DropcurrentlyWatching).then(points => {
                winston.info(chalk.gray('Watching ' + chalk.white(DropcurrentlyWatching) + ' | Points: ' + chalk.white(points.toString())), {event: "progress"})
            })
            for (const [i, drop] of CurrentDrop.timebasedrop.entries()) {
                let dropslenght = CurrentDrop.timebasedrop.length;
                    winston.info(chalk.gray("Current Progress: ") + chalk.white( minutestoPercent(drop.self.currentMinutesWatched, drop.requiredMinutesWatched)+" %") + chalk.gray(" | Watched " + chalk.white(drop.self.currentMinutesWatched + "/" + drop.requiredMinutesWatched) + " Minutes" + chalk.gray(" | Drop ") + chalk.white((i+1) + "/" + dropslenght) + chalk.gray(" | Status ") + chalk.white(drop.self.status) + chalk.gray(" | isClaimed ") + chalk.white(drop.self.isClaimed)), {event: "progress"});

            }
            winston.silly(' ', {event: "progressEnd"})
            await sendMinuteWatched(DropcurrentlyWatching)
        })
        if (userdata.settings.debug) winston.info('Interval Executed')
        if (status === 'running') await loop(DropcurrentlyWatching)
    }
}

export async function WatchingEventHandlerStop() {
    status = 'stopped'
}

export async function sendMinuteWatched(ChannelLogin: string) {
    let opts = {
        "channelLogin":ChannelLogin
    }
    let Stream = await TwitchGQL._SendQuery("UseLive", opts, '639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9', 'OAuth ' + userdata.auth_token, true);
    let channleid = Stream[0].data.user.id
    let broadcastid = Stream[0].data.user.stream.id

    const gethtml = await axios.get('https://www.twitch.tv/' + ChannelLogin, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
            'encoding': 'utf8',
            'Client-Id': userdata.clientid,
            'Authorization': 'OAuth ' + userdata.auth_token,
        },
        raxConfig: retryConfig
    }).catch(err => {
        winston.error("ERROR: Could not load https://www.twitch.tv... Check your connection...")
        throw err
    })

    let SettingsJSReg = new RegExp('https://static\.twitchcdn\.net/config/settings\.[0-9a-f]{32}\.js')
    let parsehtml = SettingsJSReg.exec(gethtml.data.toString())
    if (parsehtml![0] === null) winston.error("Error while parsing Settings Url...")

    const getSettingsJS = await axios.get(parsehtml![0].toString(), {raxConfig: retryConfig}).catch(err => {
        winston.error("ERROR: Could not load your twitch settings... Check your connection...")
        throw err
    })

    let SpadeReg = new RegExp('(https://video-edge-[.\\w\\-/]+\\.ts)')
    let parseJS = SpadeReg.exec(getSettingsJS.data.toString())
    if (parseJS![0] === null) winston.error("Error while parsing Spade URL...")

    let payload = [
        {
            "event": "minute-watched",
            "properties": {
                "channel_id": channleid.toString(),
                "broadcast_id": broadcastid.toString(),
                "player": "site",
                "user_id": userdata.userid.toString(),
            }
        }
    ]
    let json_event = JSON.stringify(payload);
    let b64 = Base64.encode(json_event)

    let config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
            "Content-type": "text/plain",
        },
        raxConfig: retryConfig
    }

    const post = await axios.post(parseJS![0].toString(), b64, config).catch(err => {
        winston.error("ERROR: Could not send minute watching event...")
        throw err
    })
    if (userdata.settings.debug) {
        winston.info('minute sent!!' + post?.status)
    }
}
