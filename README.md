<br />  
<p align="center">  
  <a href="https://github.com/Zaarrg/TTVDropBot/README.md">  
    <img src="twitch.ico" alt="Logo" width="80" height="80">  
  </a>  
  
  <h3 align="center">TTVDropBot</h3>  
  
  <p align="center">  
    Farms automatically Twitch Drops.  
    <br />  
    <a href="#about-the-project"><strong>Explore the docs »</strong></a>  
    <br />  
    <br />  
    <a href="http://www.youtube.com/watch?v=1K81IqelmtI">View Demo</a>  
    ·  
    <a href="https://github.com/Zaarrg/TTVDropBot/issues">Report Bug</a>  
    ·  
    <a href="https://github.com/Zaarrg/TTVDropBot/issues">Request Feature</a>  
  </p>
  
  
  
<!-- TABLE OF CONTENTS -->  
<details open="open">  
  <summary>Table of Contents</summary>  
  <ol>  
    <li>  
      <a href="#about-the-project">About The Project</a>  
    </li>  
    <li>  
      <a href="#getting-started">Getting Started</a>  
      <ul>  
        <li><a href="#installation">Installation</a></li>  
      </ul>  
    </li>  
        <li>  
      <a href="#usage">How to use the Bot</a>  
      <ul>  
        <li><a href="#example-video">Example Video (Outdated)</a>
        <li><a href="#step-by-step-usage">Step by Step Usage</a>
        <li><a href="#settings">Settings</a><ul>
            <li><a href="#chrome-executable">Chrome Executable</a></li>  
	        <li><a href="#userdatapath-and-autologin">UserDataPath / Auto Login</a></li> 
            <li><a href="#timeout">Timeout</a></li>  
            <li><a href="#headless">Headless</a></li>  
            <li><a href="#debug">Debug</a></li>  
            <li><a href="#displayless">Displayless</a></li>  
            <li><a href="#checkclaimedonstart">CheckClaimedOnStart</a></li>  
            <li><a href="#skiploginpage">SkipLoginPage</a></li>  
            <li><a href="#skipuserdatapathquestion ">SkipUserDataPathQuestion</a></li>  
            <li><a href="#progresscheckinterval">ProgressCheckInterval</a></li>  
            <li><a href="#auto-claim">AutoClaim</a></li>  
            <li><a href="#logtofile">LogToFile</a></li>  
</ul></li>
        <li><a href="#custom-channels-example">Custom Channel's Example</a></li>  
        <li>  
          <a href="#adding-custom-channels">Adding Custom Channel's</a>  
          <ul>  
            <li><a href="#name">Name Option</a></li>  
            <li><a href="#twitch-url">Twitch Url Option</a></li>  
            <li><a href="#how-the-channel-should-be-watched">How the Channel should be Watched Option</a></li>  
            <li><a href="#farm-points">Farm Points Option</a></li>  
            <li><a href="#editing-already-added-channels">Editing Channels</a></li>  
          </ul>  
        </li>  
      </ul>  
    </li>  
    <li><a href="#roadmap">Roadmap</a></li>  
    <li><a href="#license">License</a></li>  
    <li><a href="#contact">Contact</a></li>  
  </ol>  
</details>  
  
  
  
<!-- ABOUT THE PROJECT -->  
## About The Project  
  
![TTVDropBot](https://i.imgur.com/aHaY9la.jpg "TTVDropBot")  
  
Well I was tired of always checking which Rust Drops are available and which Streamers are Online, and most of the time while I was sleeping the "nice" Drops were Online.  
  
So I made this bot to Automatically farm Drops until you have all of them. Oh, and btw the code is a mess and im a beginner so don't expect a well coded application, use at ur own Risk.
  
Here's why:  
* You don't waste your time checking who is online.  
* You can sleep while the Bot takes care of the Drops.  
* Well and no need to open the Stream by yourself in a tab which takes up your space. :smile:  
  
  
  
  
  
<!-- GETTING STARTED -->  

## Getting Started

  
There are two ways you can use this bot.  
1. You can download the compiled version from the Releases Tab.  
2. You can clone this Project and start it with node.js  
  
### Installation  
  
* Windows Executable  
1. Download the Zip File or the Executable to your PC [https://github.com/Zaarrg/TTVDropBot/releases](https://github.com/Zaarrg/TTVDropBot/releases)  
2. Extract the Zip File into a Folder  
3. Run TTVDropBot.exe

- Linux Executable
1. [Download](https://github.com/Zaarrg/TTVDropBot/releases) the Linux executable. 
2. Give it permissions to run as executable.
3. Run TTVDropBot-linux-*
  
  
* npm - [Nodejs Required](https://nodejs.org/en/)  
1. Clone the repo to your PC [https://github.com/Zaarrg/TTVDropBot](https://github.com/Zaarrg/TTVDropBot)  
2. Install NPM packages  
   ```sh  
   npm install  
   ```  
3. Run it  
   ```sh  
   node index.js  
   ```  
  
  
  
  
<!-- USAGE EXAMPLES -->  

## Usage

  
### Example Video:
[Click to Watch: (Video a bit outdated)](http://www.youtube.com/watch?v=1K81IqelmtI)  
[![TTVDropBot](https://i.imgur.com/c5eOxWF.png)](http://www.youtube.com/watch?v=1K81IqelmtI "TTVDropBot for Rust")  
 
### Step by Step Usage:
  In the Example below you can see how to watch Rust Drops Step by Step.  
  
1. Select `Yes` if this is your Chrome Path otherwise `No` and type in your own one.
  
![Custom Channel](https://i.imgur.com/h8iseHz.png)
  
  2.  Select `Yes` if you want to provide a [UserDataPath](https://github.com/Zaarrg/TTVDropBot#userdatapath-and-autologin) otherwise just select `No`

![Custom Channel](https://i.imgur.com/LipngzC.png)

3. If previously selected `No` you will need to Log in. After that your Login will be remembered and you will be automatically logged in at the next start. More to AutoLogin can be found [here](https://github.com/Zaarrg/TTVDropBot#userdatapath-and-autologin)

![Custom Channel](https://i.imgur.com/wj7LeVU.png)

4. Select `Yes` if you want to watch [CustomChannels](https://github.com/Zaarrg/TTVDropBot#custom-channels-example), otherwise `No`

![Custom Channel](https://i.imgur.com/LyN4GfD.png)

5. The Bot will get all Drops in this Format: `URL | DropName | Status | Claimed`. With Slow Internet it can take some seconds more than normal. Then Select the Channel you want to start Watching

![Custom Channel](https://i.imgur.com/h1fgvZs.png)

6. You are successfully farming Rust Drops. The Bot will take care of the rest.

![Custom Channel](https://i.imgur.com/52IQzxv.png)

## Settings

Down below you can find the settings Variables and what they do.
  
### Chrome Executable
- The path to Google Chromes executable:
`Example: `
`Linux: google-chrome `
`Windows: C:\Program Files\Google\Chrome\Application\chrome.exe`

### UserDataPath and AutoLogin

- After Loging in for the first time the gather cookies will be saved as twitch-session.json and reused on next startup to automatically log you in or you can provide the UserDataPath and the bot will use the twitch-session cookies saved there.

- You can specify a User Profile Directory / User Data Path. This causes Chrome to save all the data to this folder and to read data from this folder. Can be Provided for AutoLogin.

- In the Example below you can see the User Data Path.  
  
![UserProfilePath](https://i.imgur.com/9D4LlXT.png)  
### Timeout
- The time in ms for how long the bot should wait for something to Load, recommended settings is 0.
`Timeout: 0 = Indefinitely`
`Timeout: 30000 = 30 Seconds` 

### Headless
- Should the bot run in headless or not. True means the bot will not show any Chrome Window. False means the bot will fully show Google Chrome, useful for checking what the bot is doing and error cause detection.

### Debug
- If enabled the Bot will log gathered Data to the console. Should only be used for error cause detection.

### Displayless
- Allows the bot to run fully automatic without any user input. Only Recommended for advanced users. Very useful for running via pm2 and running on GuiLess systems like ubuntu on a vps.

**How it Works:**

*Required in the same Path as executable for watching **Rust Drops**:*
- **settings.json** with displayless set to true
- **twitch-session.json** with the cookies or an userdatapath instead.
	- The twitch-session or UserData should be from the same operating system because when using twitch cookies from windows twitch will log you out because u a trying to login from a different OS. By changing the useragent to the OS u want to login, in a browser, and then saving those cookies and using them this can be prevented.

Example Settings File for **Linux**:

    {
      "Chromeexe": "google-chrome",
      "UserDataPath": "",
      "timeout": 0,
      "headless": true,
      "debug": false,
      "displayless": true,
      "CheckClaimedOnStart": true,
      "SkipLoginPage": true,
      "ProgressCheckInterval": 60000,
      "AutoClaim": true,
      "LogToFile": true
    }

*Required in the same Path as executable for watching **CustomChannels**:*
- **Same files as mentioned above** and additionally a **CustomChannels.json**
- As soon as a CustomChannels.json is detected the Bot will watch CustomChannels. If you dont want that just remove the CustomChannels.json

Example CustomChannels File:

    [
      {
        "Name": "rezzy",
        "TTVLink": "https://www.twitch.tv/mr_reeze",
        "WatchType": "Changed",
        "Time": -1,
        "Points": true
      },
      {
        "Name": "papaP",
        "TTVLink": "https://www.twitch.tv/papaplatte",
        "WatchType": "Time",
        "Time": "3",
        "Points": true
      }
    ]

### CheckClaimedOnStart
- Option to toggle if the bot should check the Claimed status on start. Can be disabled for slow internet connections to start faster. Will be checked anyways while getting the progress later on.

### SkipLoginPage
- Option to skip the LoginPage and prevent it from always opening on start. Only use if twitch-session.jso (cookies) are provided. 

### SkipUserDataPathQuestion
- Option to skip the UserDataPathQuestion and prevent it from always opening when not providing one.

### ProgressCheckInterval
- Option to change the Progress Interval in ms. Default is `60000` which is every `60` seconds the bot will check the progress. Can be increased for slow internet connections to prevent the bot from retrying so often.

### Auto Claim
- Automatically Claims Drops listed in your twitch inventory.

### LogToFile
- Saves the console output as File with timestamps. Two files will be created: **TTVDropBot-out.log** which are all console outputs and **TTVDropBot-error.log** which are only errors. Max File Size is 10 Mb.

## Custom Channel's Example  
  
In the Example below you can see how to use the Custom Channel's feature.  
  
1. Select `Yes` to get to the Custom Channels  
   
![Custom Channel](https://i.imgur.com/6DB4u1X.png)  
  
2. Add a Custom Channel if you didn't add any, else you can add a new one or just continue. More Details to adding a Channel are [here](https://github.com/Zaarrg/TTVDropBot#adding-custom-channels)  
  
![Add a Channel](https://i.imgur.com/0XoB7uD.png)  
  
3. Select a Channel to start Watching, you can also see the current Status of the Channel   
  
![Start Watching](https://i.imgur.com/bli9yeL.png)  
  
4. Done you are now successfully watching the channel, the bot will take care of the rest   
  
![Start Watching](https://i.imgur.com/r2skvhZ.png)  

  
## Adding Custom Channel's  
  
Down below you can find some Details about adding Channels.  
  
### Name  
- The Name can be any String, it is just for the user to identify the Channel. You can use for Example: `Rainbow Six, Best Ch ever etc...`  
  
### Twitch Url  
- The Url is very important, never use the same Url twice, it has to be a valid Channel link and has always to start with `https://www.twitch.tv/`. Example for a Valid Url: `https://www.twitch.tv/rainbow6tw`  
  
### How the Channel should be Watched  
`Changed:`  
- If you select `Changed` the Channel will be watched until the User changes it, basically watches the Channel infinitely. If the Channel goes Offline the Bot will watch another Online channel out of the Custom Channel's the User has.  
  
`Time: `  
- If you select `Time` the Channel will be watched until the Timer reaches Zero, it will watch for Example 5 Minutes if you typed in, to watch it 5 Minutes long. After that the Bot will look for a new Channel out of the Custom Channel's the User has.  
  
`Watching only one Channel: `  
- If you want to watch only one Channel even if it is Offline and dont want the bot to change it if it is offline, then you can achieve this by adding only one Channel as Custom Channel at the moment, the Bot will than have no other options and will only watch the Channel added. In this case its recommend using the `Changed` Time Option.  
  
### Farm Points:  
- Pretty simple, should the bot farm Points or not.  
  
### Editing already Added Channel's  
- You can always edit Channel's which are already added in the `CustomChannels.json`.  
  
<!-- ROADMAP -->  
## Roadmap  
  
<p align="center">!Check the todo.txt file mentioned down below for a frequently updated list!</p>  
  
Updated [todo.txt](https://github.com/Zaarrg/TTVDropBot/blob/main/src/todo) list.  
  
There are Some Features I would like to add:  
* The Bot should automatically stop if the user has all Drops.  
* Ability to go back to the selecting Twitch Channel by pressing a Key to switch channels while the Program is running.  
* Improve the 100% Event. Change it from Randomly selecting a channel to Randomly select a channel and exclude the current one. [Done] * No Event at the moment to handle the Situation of all available Streams Have 100% on the Drop. Bot would Look for new channel every 2 Minutes -> Bad Performance. [Done]  
* Stop the Bot by Pressing a key and not by terminating the window. [Done]  
* Add an Event to handle all Channels offline Situation  [Done]  
* At the moment there is no difference in Drop is already claimed or Drop Progress was not started yet. Could Result in Endless Retry loop.  [Done]  
* Add the ability to read all already claimed drops. Would prevent some bugs  [Done]  
  
  
<!-- LICENSE -->  
## License  
  
Distributed under the MIT License. See `LICENSE` for more information.  
  
  
  
<!-- CONTACT -->  
## Contact  
  
Quickest Response:  
  
[Discord Server](https://discord.gg/rV26FZ2upF): - https://discord.gg/rV26FZ2upF  
  
Slow Response:  
  
Discord: - Zarg#8467  
  
  
Project Link: [https://github.com/Zaarrg/TTVDropBot](https://github.com/Zaarrg/TTVDropBot)
