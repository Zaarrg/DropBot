const data = require("../Data/SavedData");
const chalk = require("chalk");
const {statuscheck} = require("./util");
const JsonBinIoApi = require('jsonbin-io-api');
const api = new JsonBinIoApi();

let array = [];

let xpathsdata;

async function xpaths() {

    return api.readBin({
        id: '60959e37a23274124bffde21',
        version: 'latest'
    })
        .then(res => {
            return res
        });

}


async function GetRustDrops(page, feedback) {

    //Get updated xpaths
    await xpaths().then(res => {
        xpathsdata = res;
    })

    await getDropsbypath(feedback, page)
    //await getDropsRecursive(page);
}


//Get Drops
async function getdrops(ttvlink, stat, drp, feedback, page) {

    const [link] = await page.$x(ttvlink);
    const linkhref = await link.getProperty('href')
    const rawlink = await linkhref.jsonValue();
    //Ttv Status from Rust site
    const [status] = await page.$x(stat);
    const statuscontent = await status.getProperty('textContent')
    const statusraw = await statuscontent.jsonValue();
    //Drop Item Name
    const [drop] = await page.$x(drp);
    const dropcontent = await drop.getProperty('textContent')
    const dropraw = await dropcontent.jsonValue();

    if (feedback === true) {
        console.log(" ")
        console.log(chalk.cyan(rawlink) + " | " + chalk.magenta(dropraw)+ " | " + statuscheck(JSON.stringify(statusraw)))
    }




    return {
        link: rawlink,
        Status: statusraw,
        Drop: dropraw
    }
}



async function getDropsbypath(feedback, page) {

    let {Dropsamount, Drop1, Drop2, Drop3, Drop4, Drop5, Drop6, Drop7, Drop8, Drop9} = xpathsdata;
    data.Dropsamount = Dropsamount;

    //Drop 1
    if (data.Dropsamount >= 1) {
        await getdrops(Drop1.ttvlink, Drop1.status, Drop1.drop, feedback, page).then(a => {
            data.Drop1 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }

    //Drop 2
    if (data.Dropsamount >= 2) {
        await getdrops(Drop2.ttvlink, Drop2.status, Drop2.drop, feedback, page).then(a => {
            data.Drop2 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 3
    if (data.Dropsamount >= 3) {
        await getdrops(Drop3.ttvlink, Drop3.status, Drop3.drop, feedback, page).then(a => {
            data.Drop3 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 4
    if (data.Dropsamount >= 4) {
        await getdrops(Drop4.ttvlink, Drop4.status, Drop4.drop, feedback, page).then(a => {
            data.Drop4 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 5
    if (data.Dropsamount >= 5) {
        await getdrops(Drop5.ttvlink, Drop5.status, Drop5.drop, feedback, page).then(a => {
            data.Drop5 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 6
    if (data.Dropsamount >= 6) {
        await getdrops(Drop6.ttvlink, Drop6.status, Drop6.drop, feedback, page).then(a => {
            data.Drop6 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 7
    if (data.Dropsamount >= 7) {
        await getdrops(Drop7.ttvlink, Drop7.status, Drop7.drop, feedback, page).then(a => {
            data.Drop7 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 8
    if (data.Dropsamount >= 8) {
        await getdrops(Drop8.ttvlink, Drop8.status, Drop8.drop, feedback, page).then(a => {
            data.Drop8 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
    //Drop 9
    if (data.Dropsamount >= 9) {
        await getdrops(Drop9.ttvlink, Drop9.status, Drop9.drop, feedback, page).then(a => {
            data.Drop9 = {Name: a.link, Item: a.Drop, Status: a.Status}
        })
    }
}

module.exports = {
    GetRustDrops
}