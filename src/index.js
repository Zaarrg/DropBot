const {start} = require("./functions/Start")
const readline = require('readline');
const d = require("./Data/SavedData")
const fs = require("fs");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (key, data) => {
    if (data.ctrl && data.name === 'e') {
        process.exit();
    }
});

process.argv.forEach(function (val, index, array) {
    if (val === "--debug") {
        console.log("Debug enabled")
        d.debug = true;
    }
    if (val === "--headless") {
        console.log("Headless mode disabled")
        d.headless = false;
    }
    console.log(val);
});

if (fs.existsSync("./debug.json")) {
    console.log("Debug enabled")
    d.debug = true;
}

if (fs.existsSync("./headless.json")) {
    console.log("Headless mode disabled")
    d.headless = false;
}



//Start
start();