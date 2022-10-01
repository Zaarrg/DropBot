import {userdata} from "../index";
import winston from "winston";
import chalk from "chalk";
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();

let points = 0;
export async function pointsCheck(channelLogin: string) {
  const opts = {
    channelLogin: channelLogin
  };

  const pointsrequest = await TwitchGQL._SendQuery("ChannelPointsContext", opts, '1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024', 'OAuth ' + userdata.auth_token, true, {}, true)
  points = pointsrequest[0].data.community.channel.self.communityPoints.balance  
  let channelID = pointsrequest[0].data.community.id

  await checkisClaimeable(pointsrequest, channelID, userdata.settings.AutoPoints);
  return points;
}

async function checkisClaimeable(request: any, channelId: string, autopoints: boolean) {
  let ClaimId = "";
  try {
    ClaimId = request[0].data.community.channel.self.communityPoints.availableClaim.id;
  } catch (e) {
    if (userdata.settings.debug) winston.info("No points to be claimed...");
  }

  if (ClaimId !== "") {
    //Claim Process
    const opts = {
      input: {
        channelID: channelId,
        claimID: ClaimId
      },
    };
    if (autopoints) {
      //Auto Points if possible
      const claimrequest = await TwitchGQL._SendQuery("ClaimCommunityPoints", opts, '46aaeebe02c99afdf4fc97c7c0cba964124bf6b0af229395f1f6d1feed05b3d0', 'OAuth ' + userdata.auth_token, true, {}, true);
      points = claimrequest[0].data.claimCommunityPoints.currentPoints;
      winston.info(chalk.gray('Claimed Channel Points...'), {event: "claim"});
    }
    else if (!autopoints) { 
      //Skipping Points if disabled
    winston.info(chalk.gray('Skipping Points...'), {event: "claim"});
    }
  }
}
