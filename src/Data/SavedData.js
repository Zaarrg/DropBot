//Link
const loginttv = "https://www.twitch.tv/login"
//Cookies
let LoginPageCookies;

//Twitch Drops
const rustdrops = "https://twitch.facepunch.com/"

let Streamers = [];
let claimed = [];
let Rustdrops_twitch = undefined

//Live Channels
let choi = [];
let offlinechs = [];
let dropsmap = [];
let alldropsgeneral = false;
//starting ch
let Startingchannel;

//Settings
let settings = {};
let displayless = false;
let UserDataPath;
//Custom Channels
let CustomChannels = [];
let CustomChboolean;
//Watch DAta
let cookies;
let page;
let browser;
let RustDrops = false;

//Debug
let debug = false;
let headless = true;


module.exports = {
    settings,
    alldropsgeneral,
    debug,
    Rustdrops_twitch,
    headless,
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
    CustomChannels,
    CustomChboolean,
    offlinechs,
    Streamers,
    claimed,
    displayless,
    UserDataPath
}