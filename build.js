const { compile } = require('nexe')

const inputAppName = './src/index.js'
const outputAppName = 'TTVDropBot'

let appName = 'TTVDropBot';
let description = 'Twitch Drop Bot';

let ver = "1.3.3" + ".4.0";

const rc = {
    'CompanyName': appName,
    'ProductName': appName,
    'FileDescription': description || appName,
    'FileVersion': ver,
    'ProductVersion': ver,
    'OriginalFilename': appName + '.exe',
    'InternalName': appName,
    'LegalCopyright': appName
};

compile({
    input: inputAppName,
    output: outputAppName,
    build: true,
    rc: Object.assign({
        'PRODUCTVERSION': ver,
        'FILEVERSION': ver,
    }, rc),
    ico: './twitch.ico'
}).then((err) => {
    if (err) throw err
    console.log('success')
})