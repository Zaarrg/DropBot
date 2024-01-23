<!-- markdownlint-disable MD032 MD033-->

<h1 align="center">
  <a name="logo" href="https://github.com/Zaarrg/DropBot"><img src="https://i.imgur.com/2WtgNe4.png" alt="Bear Stone Smart Home" width="200"></a>
  <br>
  DropBot
</h1>
<h4 align="center">Watches Drops for you!</h4>
<h4 align="center">This Project is currently not maintained and will most likely not work!</h4>

<div align="center">
</div>



<p align="center">
  <br>
  <a href="https://github.com/Zaarrg/DropBot/issues">
    <img src="https://img.shields.io/github/stars/Zaarrg/DropBot?color=333&style=for-the-badge&logo=github" alt="@Zaarrg/DropBot issues"/>
  </a>
    <a href="https://github.com/Zaarrg/DropBot/pulls">
    <img src="https://img.shields.io/github/commit-activity/y/Zaarrg/DropBot?color=blue&style=for-the-badge&logo=github" alt="@Zaarrg/DropBot pull requests"/>
  </a>
  <a href="https://github.com/Zaarrg/DropBot/pulls">
    <img src="https://img.shields.io/github/last-commit/Zaarrg/DropBot?color=blue&style=for-the-badge&logo=github" alt="Zaarrg/DropBot requests"/>
  </a>
      <br>
        <a href="https://discord.gg/rV26FZ2upF">
<img src="https://img.shields.io/discord/728708207907962900?color=7289DA&label=Support&logo=discord&style=for-the-badge" alt="Discord">
  </a>
        <a href="https://heroku.com/deploy?template=https://github.com/Zaarrg/DropBot/tree/main">
<img src="https://img.shields.io/badge/Deploy-Deploy?color=7056BF&label=Heroku&logo=Heroku&style=for-the-badge" alt="Discord">
  </a>
</p>

<br />

![DropBot](https://i.imgur.com/9icOyNB.png "DropBot")





## 🤔 **What is this Drop Bot all about?**

* Makes your drop experience as easy as possible.
* No need to watch the stream in a browser, fully uses gql.
* No need to care about who is online and when.
* Saves your session providing you autologin.
* Can watch every Drop / Campaign available.
* Automatically claims your Drops.
* Switches automatically to other games or drops if drop is claimed/claimable or offline.

<h3 align="center" >Disclaimer - DropBot is not intended for:</h3>

* Mining channel points - it's about the drops only.
* Mining anything else besides Twitch drops.
* Unattended operation.
* 100% uptime application, due to the underlying nature of it, expect fatal errors to happen every so often.
* Being hosted on a remote server as a 24/7 bot.
* Being used with more than one managed account.
* Any form of automatic restart when an error happens.
* Using it with more than one managed account.
* Making it possible to mine campaigns that the managed account isn't linked to.
* Anything that increases the site processing load caused by the application.
* Mining campaigns the managed account isn't linked to.
* Being associated in any way with Twitch

<br />


## ⚡ **Installation**

<h3 align="center" >Windows</h3>

1. Download the windows executable from the  **[build branch](https://github.com/Zaarrg/DropBot/tree/build)** or **[release page](https://github.com/Zaarrg/DropBot/releases)**.
2. Move the executable to a folder.
3. **Execute** the `DropBot.exe`. The **settings** and **drop-session** will be generated right beside the executable.

<h3 align="center">Linux</h3>

1. Download the linux executable from the  **[build branch](https://github.com/Zaarrg/DropBot/tree/build)** or **[release page](https://github.com/Zaarrg/DropBot/releases)**.
2. Move the executable to a folder.
3. Give the `DropBot-linux-x64` file permission to execute via chmod if needed.
    ```bash
    chmod +x ./DropBot-linux-x64
    ```

4. **Execute** the `DropBot-linux-x64`. The **settings** and **drop-session** will be generated right beside the executable.

    ```bash
    ./DropBot-linux-x64
    ```
<h3 align="center">Ubuntu</h3>
<b>Using Bot with No GUI - Only Command Line</b>

1. Download the linux executable from the  **[build branch](https://github.com/Zaarrg/DropBot/tree/build)** or **[release page](https://github.com/Zaarrg/DropBot/releases)**.
2. Drag and Drop a `settings.json` and `drop-session.json` file right beside the executable.
3. Make sure you have set `displayless` to `true` in your settings.json
4. **Execute** the `DropBot-linux-x64`.

    ```bash
    ./DropBot-linux-x64
    ```
⚠️ _If you want to specifiy wich games to watch use the **Prioritylist** setting_ ⚠️

⚠️ _If you want to watch Custom Channels drag and drop a `customchannels.json` to your executable location and set `ForceCustomChannel` in settings.json to `true`_ ⚠️

⚠️ _If you can't seem to get any progress on drops "always stuck" try loging in instead of copying drop-session.json._ ⚠️

<h3 align="center">Npm</h3>

1. Clone the **[Repository](https://github.com/Zaarrg/DropBot)**.
    ```bash
    git clone https://github.com/Zaarrg/DropBot
    ```

2. Install NPM packages.
    ```bash
    cd DropBot/
    npm install
    ```
3. Run the bot via npm scripts.
    ```bash
    npm run start:production
   OR
    npm run start:dev
    ```

<h3 align="center">Docker</h3>

1. Get your auth token

    ```bash
    docker run --rm -it ghcr.io/zaarrg/dropbot/dropbot:latest node ./build/index.js --showtoken
    ```

2. Login in, copy your auth token, and then exit the container with `Ctrl + C`

3. Create the container

    ```bash
    docker run -d --name dropbot \
    -e dropbot_displayless=true \
    -e dropbot_token=TokenFromStep1 \
    -e dropbot_games="Sea_of_Thieves Rust Lost_Ark No_Man's_Sky" \
    -e dropbot_autoclaim=true \
    ghcr.io/zaarrg/dropbot/dropbot:latest
    ```
---

## 📚 **How to use the Bot?**

<h3 align="center">Step by Step Usage: Drops</h3>

**1. Step**

<p align="center">
    <b>Select the way you want to Log in into your  account.</b><br/>
</p>

<p align="center">
⚠️ If you cant login directly because of CAPTCHA use the browser method. ⚠️<br/>
⚠️ Only Chromium Browsers are supported like Brave and Chrome . ⚠️
</p>

   ![Drops](https://i.imgur.com/ra3zm1x.png)

**2. Step**

<p align="center">
     <b>Select <code>Drops</code> to watch a Campaign or <code>Custom Channels</code> if you want to add your own channels. Refer to <a href="https://github.com/Zaarrg/DropBot/#step-by-step-usage-custom-channels">Step by Step Usage: Custom Channels</a> for those.</b><br/>
</p>

![Drops](https://i.imgur.com/DRqIkpz.png)

**3. Step**
<p align="center">
    <b>Select the campaign you want to start watching. If you want to only watch certain campaign and not all refer to <a href="https://github.com/Zaarrg/DropBot/#prioritylist">Settings: Priority list</a></b><br/>
</p>

![Drops](https://i.imgur.com/CMuV729.png)

**4. Step**
<p align="center">
    <b>Select the Drop you want to start watching.</b><br/>
</p>

![Drops](https://i.imgur.com/DzB5qjX.png)

**5. Step**
<p align="center">
    <b>🎉 Enjoy! You are successfully watching your drop.</b><br/>
</p>

![Drops](https://i.imgur.com/iNmvIZc.png)



<h3 align="center">Step by Step Usage: Custom Channels</h3>

**1. Step**
<p align="center">
    <b>Select <code>Custom Channels</code> to start watching them.</b><br/>
</p>

![Drops](https://i.imgur.com/DRqIkpz.png)

**2. Step**
<p align="center">
    <b>Fill in the needed information to add a Channel. They can always be modified in the <code>customchannel.json</code></b><br/>
</p>

![Drops](https://i.imgur.com/kBabjJL.png)

**3. Step**
<p align="center">
    <b>Select the Channel you want to start. The bot will switch between the Custom Channels, if one goes offline.</b><br/>
</p>

![Drops](https://i.imgur.com/AZt3xpU.png)

**4. Step**
<p align="center">
    <b>🎉 Enjoy! You are successfully watching your Custom Channel.</b><br/>
</p>

![Drops](https://i.imgur.com/k95h9Tu.png)


<h3 align="center">Step by Step Usage: Heroku</h3>

<p align="center">
⚠️ Only Recommended for advanced users. ⚠️<br/>
</p>

**1. Step**
<p align="center">
    <b>Click on the Deploy to Heroku Button at the top of the Readme</b><br/>
</p>

![Drops](https://i.imgur.com/1ll6yjV.png)

**2. Step**
<p align="center">
    <b>Login if necessary, and choose any app name you want, select your region and click Deploy app</b><br/>
    <b>After that let Heroku go through the build process and then click on Manage App</b><br/>
</p>

![Drops](https://i.imgur.com/oIm3m52.png)

**3. Step**
<p align="center">
    <b>Go to the Resources tab and disable the web dyno and enable the worker instead</b><br/>
</p>

![Drops](https://i.imgur.com/5XeKXRC.png)

**4. Step**
<p align="center">
    <b>Click on more in the top right corner and then on Run console.</b><br/>
    <b>Type in bash and click Run.</b><br/>
</p>

![Drops](https://i.imgur.com/Q7mArVd.png)

**5. Step**
<p align="center">
    <b>Now run the command <code>node ./build/index.js --showtoken</code> in the Terminal.</b><br/>
    <b>Login Directly via command Line, until you see your auth token and copy it.</b><br/>
</p>

![Drops](https://i.imgur.com/qfJV0OQ.png)

**6. Step**

<p align="center">
    <b>Close the Terminal and go to Settings then Reveal Config Vars</b><br/>
    <b>Now type in as key <code>dropbot_token</code> and as value your copied token and click add</b><br/>
    <b>You can find more environment variables</b>
      <a href="https://github.com/Zaarrg/DropBot#%EF%B8%8F-environment-variables">here</a>
</p>

![Drops](https://i.imgur.com/EnB36ih.png)

**7. Step**
<p align="center">
    <b>🎉 Thats it Enjoy! You are successfully watching.</b><br/>
    <b>To check if its working click on more in the top right corner then view logs.</b><br/>
    <b>Give it some time to start up, and you should see the bot working.</b><br/>
</p>

![Drops](https://i.imgur.com/7Jrsojx.png)


---

## 📝 **Settings**

Down below you can find the settings Variables and what they do.

### Chromeexe
 - The path of your Browser: <code>Linux: google-chrome | Windows: C:\Program Files\Google\Chrome\Application\chrome.exe</code>

### UserDataPath
- Providing a userdatapath, will give the loginpage the option to use cookies out of your browser. Option not really needed anymore.
- You can find the UserdataPath under <code>chrome://version</code> then under <code>Profile Path</code>

### Webhook
- The Discord Webhook URL: <code> https://discord.com/api/webhooks/... </code>

### WebHookEvents
- Set what events should be send via webhook.
- Defaults to: <code>["requestretry", "claim", "newdrop", "offline", "newgame", "get", "getresult", "progress", "start", "error", "warn", "info"]</code>

### Debug
- Will log important values to the console for debugging.

### Displayless
- Give the ability to use the bot fully automated with no user input needed. Especially useful for gui-less systems. See [Ubuntu - No Gui](https://github.com/Zaarrg/DropBot/#ubuntu)

### ForceCustomChannel
- Force the bot to watch Custom Channels, only useful for display-less mode.

### ProgressCheckInterval
- The time in ms, in what interval the progress should be checked. Recommended is `60000 ms - 60 s` anything under could cause blocking your request.

### RetryDelay
- The time in ms, in what interval failed requests should be retried. Recommended is `60000 ms - 60 s` anything under could cause blocking your request.

### WaitforChannels
- If set to false the Bot will no longer wait 5 Minutes for new Channels to come online. It will switch to another game instead.

### Prioritylist
- A list of Games the bot should watch / prioritize. Only Provide games with active Drop Campaigns in this Format:
    `["Rust","Fortnite", "Elite: Dangerous"]` 
- You can get the valid name from
- If provided the bot will only watch the games listed.

### AutoClaim
- Allow the bot to autoClaim or not

### LogToFile
- Log the Console to a file.

### UseKeepAlive
- If activated uses Express to the keepalive the bot useful for stuff like Replit.

<br/>

---

## ✏️ **Start Arguments**

All available start Arguments, basically everything which is also in the [settings.json](https://github.com/Zaarrg/DropBot#-settings) file.

```bash
./DropBot.exe --help

Usage: ./DropBot or index.js --arg...

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
--token                             Your auth_token. [string]
-d, --debug                         Enable Debug logging. [boolean]
--displayless, --dl                 Enable Displayless mode. [boolean]
--forcecustomchannel                Force Custom Channels. Only useful for
                                    display-less mode. [boolean]
--waitforchannels, --waitonline     Disable waitforchannels, forcing the bot to not wait 
                                    for other channels with drops instead switch the game. [boolean]
--autoclaim                         Enable autoclaim. [boolean]
--log                               Enable logging to file. [boolean]
--usekeepalive                      Enable Express KeepAlive. [boolean]
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
--token yourkindalongtoken                Sets the your current  auth
                                          token, overwriting any in
                                          drop-session.json.

```

## ✏️ **Environment variables**

All these Start Arguments also work as environment variable:

```bash
dropbot_chrome = YourPath
dropbot_userdata = YourPath
dropbot_webhook = DiscordWebhookURL
dropbot_interval = 60000
dropbot_games = Game1 Game2 Game3... ⚠️ Black Desert -> Black_Desert ⚠️
dropbot_debug = true || false
dropbot_displayless = true || false
dropbot_forcecustomchannel = true || false
dropbot_waitforchannels = true || false
dropbot_autoclaim = true || false
dropbot_log = true || false
dropbot_usekeepalive = true || false
dropbot_retryinterval = 60000
dropbot_webhookevents = Event1 Event2 Event3...
dropbot_showtoken = true || false  Usefull for System were you cant access your drop-session.json
dropbot_token = YourToken
```

## 📘 Adding Custom Channels

<br/>

![Drops](https://i.imgur.com/kBabjJL.png)

### Name
- The Name can be any String like `Rainbow Six, Best Ch ever etc...`

### Url
- The Url is very important, never use the same Url twice, it has to be a valid Channel link and has always to start with `https://www..tv/`. Example for a Valid Url: `https://www..tv/rainbow6tw`

### How the Channel should be Watched

`Watch until the time runs out:`
- Watches the channel until the left time reaches 0 then switches to other custom channel.

`Watch indefinitely:`
- Watches the channel until it goes offline, then switches.

### Farm Points
- Pretty simple, should the bot farm Points or not.

### Editing already Added Channel's
- You can always edit Channel's which are already added in the [CustomChannels.json]('https://github.com/Zaarrg/DropBot/#example-customchannelsjson').


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
   "LogToFile": true,
   "ForceCustomChannel": false,
   "UseKeepAlive": false
}
```

### Example CustomChannels.json
```json
[
  {
    "Name": "tarik",
    "Link": "https://www..tv/tarik",
    "WatchType": "Watch until time runs out",
    "Time": "50",
    "Points": true
  }
]
```

### Example  Session
```json
[
  {
    "name": "auth-token",
    "value": "yourtoken"
  }
]
```

⚠️ _Never share your **Token** with anyone, because it gives full access to your account_ ⚠️



---

## 🎉 Enjoy the bot and hopefully its helpful!

[![GitHub's followers](https://img.shields.io/github/followers/Zaarrg.svg?style=social)](https://github.com/Zaarrg)
[![GitHub stars](https://img.shields.io/github/stars/Zaarrg/DropBot.svg?style=social)](https://github.com/Zaarrg/DropBot/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/Zaarrg/DropBot.svg?style=social)](https://github.com/Zaarrg/DropBot/watchers)
[![GitHub forks](https://img.shields.io/github/forks/Zaarrg/DropBot.svg?style=social)](https://github.com/Zaarrg/DropBot/network/members)

If you like my work feel free to buy me a coffee. ☕

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://ko-fi.com/zaarrg)

Have fun and Enjoy! 😃

---

## 🍰 Contact

**_Quickest Response:_** <br/>
Discord Server: https://discord.gg/rV26FZ2upF

**_Slow Response:_**<br/>
Discord: - Zarg#8467


> Distributed under the MIT License. See LICENSE for more information.⚠️

_Made with a lot of ❤️❤️ by **[@Zarg](https://github.com/Zaarrg)**_
