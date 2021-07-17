//Link
const loginttv = "https://www.twitch.tv/login"
//Cookies
let LoginPageCookies;

//Twitch Drops
const rustdrops = "https://twitch.facepunch.com/"

let Streamers = [];
let claimed = [];

//Live Channels
let choi = [];
let offlinechs = [];
let dropsmap = [];

//starting ch
let Startingchannel;

let Executablepath;
let UserDataDir;
let UserDataDirboolean;


//settings
let settings = [];
let CustomChannels = [];
let CustomChboolean;
//Watch DAta
let cookies;
let page;
let browser;
let RustDrops = false;


module.exports = {
    cookies,
    RustDrops,
    page,
    browser,
    loginttv,
    LoginPageCookies,
    rustdrops,
    choi,
    dropsmap,
    Startingchannel,
    Executablepath,
    UserDataDir,
    UserDataDirboolean,
    settings,
    CustomChannels,
    CustomChboolean,
    offlinechs,
    Streamers,
    claimed
}