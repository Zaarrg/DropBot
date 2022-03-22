import {Drop} from "../functions/get/getCurrentDrop";
import winston from "winston";
import chalk from "chalk";
import {restartHandler} from "../functions/handler/restartHandler";
import {userdata} from "../data/userdata";
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();

export async function claimableCheck(CurrentDrop: Drop, autoclaim: boolean) {
    //filter all non active drops
    let nonworkingamount = 0;
    CurrentDrop.timebasedrop.forEach(timedrop => {
        if (timedrop.self.status === 'Not Active' || timedrop.self.status === 'Ended') {
            nonworkingamount++
        }
    })

    let timebasedlenght = (CurrentDrop.timebasedrop.length - nonworkingamount)
    let hundredpercent = 0;
    let isclaimedamount = 0;

    for (const timedrop of CurrentDrop.timebasedrop) {
        if (timedrop.requiredMinutesWatched === timedrop.self.currentMinutesWatched) {
            hundredpercent++
        }
        if (timedrop.self.isClaimed) {
            isclaimedamount++
        }

        if (autoclaim) {
            //Auto Claim if possible
            for (const benefit of timedrop.benefitEdges) {
                if (timedrop.self.currentMinutesWatched === timedrop.requiredMinutesWatched && timedrop.self.dropInstanceID !== null) {

                    let opts = {
                        "input":{
                            "dropInstanceID": timedrop.self.dropInstanceID.toString()
                        }
                    }
                    await TwitchGQL._SendQuery("DropsPage_ClaimDropRewards", opts, 'a455deea71bdc9015b78eb49f4acfbce8baa7ccbedd28e549bb025bd0f751930', 'OAuth ' + userdata.auth_token, true)
                    winston.info(chalk.gray('Claimed ' + chalk.green(timedrop.name)))

                }
            }
        }
    }

    //Check if all Drops of the game are claimed/claimable
    await allgameddropsclaimableCheck()

    if (userdata.settings.debug) winston.info('Claim CHECK ONE ' + hundredpercent + ' | ' + timebasedlenght + ' | ' + isclaimedamount)
    //All Claimable
    if (hundredpercent >= timebasedlenght) {
        winston.info(' ')
        winston.info(chalk.green('All Drops Claimable... Looking for new ones...'))
        await restartHandler(true, true, true, true, false)
    } else if (isclaimedamount >= timebasedlenght) {
        winston.info(' ')
        winston.info(chalk.green('All Drops Claimed... Looking for new ones...'))
        CurrentDrop.isClaimed = true
        await restartHandler(true, true, true, true, false)
    } else if ( (isclaimedamount + hundredpercent) >=timebasedlenght) {
        winston.info(' ')
        winston.info(chalk.green('All Drops Claimable or Claimed... Looking for new ones...'))
        await restartHandler(true, true, true, true, false)
    }



}

async function allgameddropsclaimableCheck() {
    for (const drop of userdata.drops) {
        //filter all non active drops
        let nonworkingamount = 0;
        drop.timebasedrop.forEach(timedrop => {
            if (timedrop.self.status === 'Not Active' || timedrop.self.status === 'Ended') {
                nonworkingamount++
            }
        })

        let amount = 0;
        let isclaimedorclaimableamount = 0;
        drop.timebasedrop.forEach(time => {
            amount++
            if (time.requiredMinutesWatched === time.self.currentMinutesWatched || time.self.isClaimed === true) {
                isclaimedorclaimableamount++
            }
        })
        if (userdata.settings.debug) winston.info('Claim CHECK LOOP ' + isclaimedorclaimableamount + ' | ' + amount + ' | ' + nonworkingamount)
        if (isclaimedorclaimableamount >= (amount-nonworkingamount)) {
            winston.info(' ')
            winston.info(chalk.green('All drops of the game claimed or claimable... Looking for a new Game....'))
            await restartHandler(true, true, true, true, true)
        }
    }
}



export async function matchClaimedDrops() {
    //Check if Drop isclaimed
    let claimeddrops = 0;
    userdata.claimedDrops.forEach(claimeddrop => {
        userdata.drops.forEach(drop => {
            drop.timebasedrop.forEach(timebasedrop => {
                timebasedrop.benefitEdges.forEach(benefit => {
                    if (claimeddrop.imageurl === benefit.benefit.imageAssetURL) {
                        try {
                            timebasedrop.self.isClaimed = true
                        } catch (e) {
                            timebasedrop['self'] = {
                                __typename: "TimeBasedDropSelfEdge",
                                currentMinutesWatched: 0,
                                dropInstanceID: null,
                                isClaimed: true
                            }
                        }
                        claimeddrops++
                    }
                })
                if (drop.timebasedrop.length === claimeddrops) {
                    drop.isClaimed = true;
                }
            })
        })
    })
}