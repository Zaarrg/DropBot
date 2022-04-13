<!-- markdownlint-disable MD032 MD033-->

<h1 align="center">
  <a name="logo" href="https://github.com/Zaarrg/TTVDropBot"><img src="https://i.imgur.com/2WtgNe4.png" alt="Bear Stone Smart Home" width="200"></a>
  <br>
  TTVDropBot
</h1>
<h4 align="center">Farms automatically Twitch Drops for you!</h4>
<div align="center">
</div>



<p align="center">
  <br>
  <a href="https://github.com/Zaarrg/TTVDropBot/issues">
    <img src="https://img.shields.io/github/stars/Zaarrg/TTVDropBot?color=333&style=for-the-badge&logo=github" alt="@Zaarrg/TTVDropBot issues"/>
  </a>
    <a href="https://github.com/Zaarrg/TTVDropBot/pulls">
    <img src="https://img.shields.io/github/commit-activity/y/Zaarrg/TTVDropBot?color=blue&style=for-the-badge&logo=github" alt="@Zaarrg/TTVDropBot pull requests"/>
  </a>
  <a href="https://github.com/Zaarrg/TTVDropBot/pulls">
    <img src="https://img.shields.io/github/last-commit/Zaarrg/TTVDropBot?color=blue&style=for-the-badge&logo=github" alt="Zaarrg/TTVDropBot requests"/>
  </a>
      <br>
        <a href="https://discord.gg/rV26FZ2upF">
<img src="https://img.shields.io/discord/728708207907962900?color=7289DA&label=Support&logo=discord&style=for-the-badge" alt="Discord">
  </a>
        <a href="https://heroku.com/deploy?template=https://github.com/Zaarrg/TTVDropBot/tree/main">
<img src="https://img.shields.io/badge/Deploy-Deploy?color=7056BF&label=Heroku&logo=Heroku&style=for-the-badge" alt="Discord">
  </a>
</p>

<br />

![TTVDropBot](https://i.imgur.com/9icOyNB.png "TTVDropBot")





## 🤔 **What is this Twitch Bot all about?**

* Makes your twitch drop experience as easy as possible.
* No need to watch the stream in a browser, fully uses twitch inner gql.
* No need to care about who is online and when.
* Saves your twitch session providing you autologin.
* Can watch every Twitch Drop / Campaign available.
* Automatically claims your Drops.
* Switches automatically to other games or drops if drop is claimed/claimable or offline.
* Send Discord Webhooks to your server.

<br />


## ⚡ **Installation**

<h3 align="center" >Windows</h3>

1. Download the windows executable from the  **[release page](https://github.com/Zaarrg/TTVDropBot/releases)**.
2. Move the executable to a folder.
3. **Execute** the `TTVDropBot.exe`. The **settings** and **twitch-session** will be generated right beside the executable.

<h3 align="center">Linux</h3>

1. Download the linux executable from the  **[release page](https://github.com/Zaarrg/TTVDropBot/releases)**.
2. Move the executable to a folder.
3. Give the `TTVDropBot-linux-x64` file permission to execute via chmod if needed.
    ```bash
    chmod +x ./TTVDropBot-linux-x64
    ```

4. **Execute** the `TTVDropBot-linux-x64`. The **settings** and **twitch-session** will be generated right beside the executable.

    ```bash
    ./TTVDropBot-linux-x64
    ```
<h3 align="center">Ubuntu</h3>
<b>Using Bot with No GUI - Only Command Line</b>

1. Download the linux executable from the  **[release page](https://github.com/Zaarrg/TTVDropBot/releases)**.
2. Drag and Drop a `settings.json` and `twitch-session.json` file right beside the executable.
3. Make sure you have set `displayless` to `true` in your settings.json
4. **Execute** the `TTVDropBot-linux-x64`.

    ```bash
    ./TTVDropBot-linux-x64
    ```
⚠️ _If you want to specifiy wich games to watch use the **Prioritylist** setting_ ⚠️

⚠️ _If you want to watch Custom Channels drag and drop a `customchannels.json` to your executable location_ ⚠️


<h3 align="center">Npm</h3>

1. Clone the **[Repository](https://github.com/Zaarrg/TTVDropBot)**.
    ```bash
    git clone https://github.com/Zaarrg/TTVDropBot
    ```

2. Install NPM packages.
    ```bash
    cd TTVDropBot/
    npm install
    ```
3. Run the bot via npm scripts.
    ```bash
    npm run start:production
   OR
    npm run start:dev
    ```
---

## 📚 **How to use the Bot?**

<h3 align="center">Step by Step Usage: Twitch Drops</h3>

**1. Step**

<p align="center">
    <b>Select the way you want to Log in into your twitch account.</b><br/>
</p>

<p align="center">
⚠️ If you cant login directly because of CAPTCHA use the browser method. ⚠️<br/>
⚠️ Only Chromium Browsers are supported like Brave and Chrome . ⚠️
</p>

   ![Twitch Drops](https://i.imgur.com/ra3zm1x.png)

**2. Step**

<p align="center">
     <b>Select <code>Twitch Drops</code> to watch a Twitch Campaign or <code>Custom Channels</code> if you want to add your own channels. Refer to <a href="https://github.com/Zaarrg/TTVDropBot/#step-by-step-usage-custom-channels">Step by Step Usage: Custom Channels</a> for those.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/DRqIkpz.png)

**3. Step**
<p align="center">
    <b>Select the campaign you want to start watching. If you want to only watch certain campaign and not all refer to <a href="https://github.com/Zaarrg/TTVDropBot/#prioritylist">Settings: Priority list</a></b><br/>
</p>

![Twitch Drops](https://i.imgur.com/CMuV729.png)

**4. Step**
<p align="center">
    <b>Select the Drop you want to start watching.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/DzB5qjX.png)

**5. Step**
<p align="center">
    <b>🎉 Enjoy! You are successfully watching your drop.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/iNmvIZc.png)



<h3 align="center">Step by Step Usage: Custom Channels</h3>

**1. Step**
<p align="center">
    <b>Select <code>Custom Channels</code> to start watching them.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/DRqIkpz.png)

**2. Step**
<p align="center">
    <b>Fill in the needed information to add a Channel. They can always be modified in the <code>customchannel.json</code></b><br/>
</p>

![Twitch Drops](https://i.imgur.com/kBabjJL.png)

**3. Step**
<p align="center">
    <b>Select the Channel you want to start. The bot will switch between the Custom Channels, if one goes offline.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/AZt3xpU.png)

**4. Step**
<p align="center">
    <b>🎉 Enjoy! You are successfully watching your Custom Channel.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/k95h9Tu.png)

---

## 📝 **Settings**

Down below you can find the settings Variables and what they do.

### Chromeexe
 - The path of your Browser: <code>Linux: google-chrome | Windows: C:\Program Files\Google\Chrome\Application\chrome.exe</code>

### UserDataPath
- Providing a userdatapath, will give the loginpage the option to use cookies out of your browser. Option not really needed anymore.
- You can find the UserdataPath under <code>chrome://version</code> then under <code>Profile Path</code>

###Webhook
- The Discord Webhook URL: <code> https://discord.com/api/webhooks/... </code>

###WebHookEvents
- Set what events should be send via webhook.
- Defaults to: <code>["requestretry", "claim", "newdrop", "offline", "newgame", "get", "getresult", "progress", "start", "error", "warn", "info"]</code>

### Debug
- Will log important values to the console for debugging.

### Displayless
- Give the ability to use the bot fully automated with no user input needed. Especially useful for gui-less systems. See [Ubuntu - No Gui](https://github.com/Zaarrg/TTVDropBot/#ubuntu)

### ProgressCheckInterval
- The time in ms, in what interval the progress should be checked. Recommended is `60000 ms - 60 s` anything under could cause twitch blocking your request.

### RetryDelay
- The time in ms, in what interval failed requests should be retried. Recommended is `60000 ms - 60 s` anything under could cause twitch blocking your request.

### WaitforChannels
- If set to false the Bot will no longer wait 5 Minutes for new Channels to come online. It will switch to another game instead.

### Prioritylist
- A list of Games the bot should watch / prioritize. Only Provide games with active Drop Campaigns in this Format:
    `["Rust","Fortnite", "Elite: Dangerous"]` 
- You can get the valid name from: `https://www.twitch.tv/directory`
- If provided the bot will only watch the games listed.

### AutoClaim
- Allow the bot to autoClaim or not

### LogToFile
- Log the Console to a file.

<br/>

---

## ✏️ **Start Arguments and environment variables**

All available start Arguments, basically everything which is also in the [settings.json](https://github.com/Zaarrg/TTVDropBot#-settings) file.

```bash
./TTVDropBot.exe --help

Usage: ./TTVDropBot or index.js --arg...

Options:
--help                              Show help. [boolean]
--version                           Show version number. [boolean]
-c, --chrome                        The path to your Chrome executable. [string]
-u, --userdata                      The path to your userdata folder location. [string]
--webhook, --wh                     The Discord Webhook URL. [string]
--webhookevents                     Set what events should be send via webhook. [array]
-i, --interval                      The progress interval in ms. [number]
--retryinterval, --retry            The retry interval in ms. [number]
-g, --games                         The Games the bot should watch. [array]
--token                             Your twitch auth_token. [string]
-d, --debug                         Enable Debug logging. [boolean]
--displayless, --dl                 Enable Displayless mode. [boolean]
--waitforchannels, --waitonline     Disable waitforchannels, forcing the bot to not wait 
                                    for other channels with drops instead switch the game. [boolean]
--autoclaim                         Enable autoclaim. [boolean]
--log                               Enable logging to file. [boolean]
--tray                              Start app in the tray. [boolean]

Examples:
--chrome C:path:to:chrome.exe             Sets your chrome path.
--userdata C:path:to:userdata-folder      Sets your userdata path.
--webhook https:discord.com:api:webh....  Sets your webhook url.
--webhookevents requestretry claim        Defaults to the events in this
newdrop offline newgame get getresult     example provided.
progress start error warn info
--interval 30000                          Sets the progress interval to 30s.
--retryinterval 30000                     Sets the retry interval to 30s.
--games Rust Krunker 'Elite: Dangerous'   Sets the Prioritylist to Rust,
Krunker and Elite: Dangerous.
--token yourkindalongtoken                Sets the your current twitch auth
                                          token, overwriting any in
                                          twitch-session.json.

```

All these Arguments also work as environment variable:

```bash
ttvdropbot_chrome = YourPath
ttvdropbot_userdata = YourPath
ttvdropbot_webhook = DiscordWebhookURL
ttvdropbot_interval = 60000
ttvdropbot_games = Game1 Game2 Game3... ⚠️ Black Desert -> Black_Desert ⚠️
ttvdropbot_debug = true || false
ttvdropbot_displayless = true || false
ttvdropbot_waitforchannels = true || false
ttvdropbot_autoclaim = true || false
ttvdropbot_log = true || false
ttvdropbot_retryinterval = 60000
ttvdropbot_webhookevents = Event1 Event2 Event3...
ttvdropbot_token = YourToken
```

## 📘 Adding Custom Channels

<br/>

![Twitch Drops](https://i.imgur.com/kBabjJL.png)

### Name
- The Name can be any String like `Rainbow Six, Best Ch ever etc...`

### Twitch Url
- The Url is very important, never use the same Url twice, it has to be a valid Channel link and has always to start with `https://www.twitch.tv/`. Example for a Valid Url: `https://www.twitch.tv/rainbow6tw`

### How the Channel should be Watched

`Watch until the time runs out:`
- Watches the channel until the left time reaches 0 then switches to other custom channel.

`Watch indefinitely:`
- Watches the channel until it goes offline, then switches.

### Farm Points
- Pretty simple, should the bot farm Points or not.

### Editing already Added Channel's
- You can always edit Channel's which are already added in the [CustomChannels.json]('https://github.com/Zaarrg/TTVDropBot/#example-customchannelsjson').


---

## 📄 Json Files Examples

### Example Settings.json
```json
{
   "Chromeexe": "",
   "UserDataPath": "",
   "WebHookURL": "",
   "WebHookEvents": [],
   "debug": false,
   "displayless": false,
   "ProgressCheckInterval": 60000,
   "RetryDelay": 60000,
   "WaitforChannels": true,
   "Prioritylist": [],
   "AutoClaim": true,
   "LogToFile": true
}
```

### Example CustomChannels.json
```json
[
  {
    "Name": "tarik",
    "TTVLink": "https://www.twitch.tv/tarik",
    "WatchType": "Watch until time runs out",
    "Time": "50",
    "Points": true
  }
]
```

### Example Twitch Session
```json
[
  {
    "name": "auth-token",
    "value": "yourtoken"
  }
]
```



---

## 🎉 Enjoy the bot and hopefully its helpful!

[![GitHub's followers](https://img.shields.io/github/followers/Zaarrg.svg?style=social)](https://github.com/Zaarrg)
[![GitHub stars](https://img.shields.io/github/stars/Zaarrg/TTVDropBot.svg?style=social)](https://github.com/Zaarrg/TTVDropBot/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/Zaarrg/TTVDropBot.svg?style=social)](https://github.com/Zaarrg/TTVDropBot/watchers)
[![GitHub forks](https://img.shields.io/github/forks/Zaarrg/TTVDropBot.svg?style=social)](https://github.com/Zaarrg/TTVDropBot/network/members)

Have fun and Enjoy! 😃

---

## 🍰 Contact

**_Quickest Response:_** <br/>
Discord Server: https://discord.gg/rV26FZ2upF

**_Slow Response:_**<br/>
Discord: - Zarg#8467


> Distributed under the MIT License. See LICENSE for more information.⚠️

_Made with a lot of ❤️❤️ by **[@Zarg](https://github.com/Zaarrg)**_
