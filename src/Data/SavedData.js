//Link
const loginttv = "https://www.twitch.tv/login"
//Cookies
let LoginPageCookies;

//Twitch Drops
const rustdrops = "https://twitch.facepunch.com/"

//Who is Live
let Drop1 = {};
let Drop2 = {};
let Drop3 = {};
let Drop4 = {};
let Drop5 = {};
let Drop6 = {};
let Drop7 = {};
let Drop8 = {};
let Drop9 = {};
let Drop10 = {};
let Drop11 = {};
let Drop12 = {};

//Amount of Drops avaiable
let Dropsamount = 12;

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
    Drop1,
    Drop2,
    Drop3,
    Drop4,
    Drop5,
    Drop6,
    Drop7,
    Drop8,
    Drop9,
    Drop10,
    Drop11,
    Drop12,
    Dropsamount,
    choi,
    dropsmap,
    Startingchannel,
    Executablepath,
    UserDataDir,
    UserDataDirboolean,
    settings,
    CustomChannels,
    CustomChboolean,
    offlinechs
}