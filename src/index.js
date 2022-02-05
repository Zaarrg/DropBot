const {start} = require("./functions/Start")
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (key, data) => {
    if (data.ctrl && data.name === 'e') {
        process.exit();
    }
});

//Start
start();