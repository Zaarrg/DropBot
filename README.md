



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Zaarrg/TTVDropBot/README.md">
    <img src="twitch.ico" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">TTVDropBot</h3>

  <p align="center">
    Farms automaticlly Twitch Drops.
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
      <a href="#usage">Getting Started</a>
      <ul>
        <li><a href="#UserProfilDirectory">UserProfilDirectory</a></li>
        <li><a href="#custom-channels-example">Custom Channel's Example</a></li>
        <li>
          <a href="#adding-custom-channels">Adding Custom Channel's</a>
          <ul>
            <li><a href="#Name">Name Option</a></li>
            <li><a href="#Twitch-Url">Twitch Url Option</a></li>
            <li><a href="#How-the-Channel-should-be-Watched">How the Channel should be Watched Option</a></li>
            <li><a href="#Farm-Points">Farm Points Option</a></li>
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

Well i was tired of always checking which Rust Drops are avaiable and which Streamers are Online, and most of the time while i was sleeping the "nice" Drops were Online.

So i made this bot to Automaticlly farm Drops unitl you have all of them. Oh and btw the code is a mess and im a beginner so dont expect a well coded application.

Here's why:
* You dont waste your time checking who is online.
* You can sleep while the Bot takes care of the Drops.
* Well and no need to open the Stream by urself in a tab which takes up your space. :smile:





<!-- GETTING STARTED -->
## Getting Started

There are two ways you can use this bot.
1. You can dowloaded the compiled version from the Releases Tab.
2. You can clone this Project and start it with node.js

### Installation

* Executable
1. Dowload the Zip File with the Executable and NPM packages to your PC [https://github.com/Zaarrg/TTVDropBot/releases](https://github.com/Zaarrg/TTVDropBot/releases)
2. Extract the Zip File into a Folder
3. Run TTVDropBot.exe


* npm
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

[Click to Watch:](http://www.youtube.com/watch?v=1K81IqelmtI)
[![TTVDropBot](https://i.imgur.com/c5eOxWF.png)](http://www.youtube.com/watch?v=1K81IqelmtI "TTVDropBot for Rust")


## UserProfilDirectory

- You can specify a User Profil Directory. This allows for Auto Login after the first sign in.  
- In the Example below you can see the User Data Profile.

![UserProfilePath](https://i.imgur.com/9D4LlXT.png)

## Custom Channel's Example

In the Example below you can see how to use the Custom Channel's feature.

1. Select `Yes` to get to the Custom Channels
 
![Custom Channel](https://i.imgur.com/6DB4u1X.png)

2. Add a Custom Channel if you didn't add any, else you can add a new one or just continue. More Details to adding a Channel are [here](          https://github.com/Zaarrg/TTVDropBot#adding-custom-channels)

![Add a Channel](https://i.imgur.com/0XoB7uD.png)

3. Select a Channel to start Watching, you can also see the current Status of the Channel 

![Start Watching](https://i.imgur.com/bli9yeL.png)

4. Done you are now successfully watching the channel, the bot will take care of the rest 

![Start Watching](https://i.imgur.com/r2skvhZ.png)


## Adding Custom Channel's

Done below you can find some Details about adding Channels.

### Name
- The Name can be any String, it is just for the user to identify the Channel. You can use for Example: `Rainbow Six, Best Ch ever etc...`

### Twitch Url
- The Url is very important, never use the same Url twice, it has to be a vaild Channel link and has always to start with `https://www.twitch.tv/`. Example for a Vaild Url: `https://www.twitch.tv/rainbow6tw`

### How the Channel should be Watched
`Changed:`
- If you select `Changed` the Channel will be watched until the User changes it, basicly watches the Channel infinitely. If the Channel goes Offline the Bot will watch another Online channel out of the Custom Channel's the User has.

`Time: `
- If you select `Time` the Channel will be watched until the Timer reaches Zero, it will watch for Example 5 Minutes if you typed in, to watch it 5 Minutes long. After that the Bot will look for a new Channel out of the Custom Channel's the User has.

`Watching only one Channel: `
- If you want to watch only one Channel even if it is Offline and dont want the bot to change it if it is offline, then you can achieve this by adding only one Channel as Custom Channel at the moment, the Bot will than have no other options and will only watch the Channel added. In this case its recommened to use the `Changed` Time Option.

### Farm Points:
- Pretty simple, should the bot farm Points or not.

### Editing already Added Channel's
- You can always edit Channel's which are already added in the `CustomChannels.json`.

<!-- ROADMAP -->
## Roadmap

<p align="center">!Check the todo.txt file mentioned down below for a frequently updated list!</p>

Updated [todo.txt](https://github.com/Zaarrg/TTVDropBot/blob/main/src/todo) list.

There are Some Features i would like to add:
* The Bot should automaticlly stop if the user has all Drops.
* Ability to go back to the selecting Twitch Channel by pressing a Key to switch channels while the Programm is running.
* Improve the 100% Event. Change it from Randomly selecting a channel to Randomly select a channel and exclude the current one. [Done] 
* No Event at the moment to handel the Situation of all avaiable Streams Have 100% on the Drop. Bot would Look for new channel every 2 Minutes -> Bad Performance. [Done]
* Stop the Bot by Pressing a key and not by terminating the window. [Done]
* Add a Event to handel all Channels offline Situation
* At the moment there is no difference in Drop is already claimed or Drop Progress was not started yet. Could Result in Endless Retry loop.
* Add the ability to read all already claimed drops. Would prevent some bugs


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Discord: - Zarg#8467

Project Link: [https://github.com/Zaarrg/TTVDropBot](https://github.com/Zaarrg/TTVDropBot)


