const data = require("../Data/SavedData");
const chalk = require("chalk");
const {statuscheck} = require("./util");


async function GetRustDrops(page, feedback) {
    await getDropsbypath(feedback, page)
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
    //Drop 1
    await getdrops('/html/body/section[1]/div/div[2]/a[1]', '/html/body/section[1]/div/div[2]/a[1]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[1]/div[3]/span', feedback, page).then(a => {
        data.Drop1 = {Name: a.link, Item: a.Drop, Status: a.Status}
    })
    //Drop 2
    await getdrops('/html/body/section[1]/div/div[2]/a[2]', '/html/body/section[1]/div/div[2]/a[2]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[2]/div[3]/span', feedback, page).then(a => {
        data.Drop2 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 3
    await getdrops('/html/body/section[1]/div/div[2]/a[3]', '/html/body/section[1]/div/div[2]/a[3]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[3]/div[3]/span', feedback, page).then(a => {
        data.Drop3 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 4
    await getdrops('/html/body/section[1]/div/div[2]/a[4]', '/html/body/section[1]/div/div[2]/a[4]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[4]/div[3]/span', feedback, page).then(a => {
        data.Drop4 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 5
    await getdrops('/html/body/section[1]/div/div[2]/a[5]', '/html/body/section[1]/div/div[2]/a[5]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[5]/div[3]/span', feedback, page).then(a => {
        data.Drop5 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 6
    await getdrops('/html/body/section[1]/div/div[2]/a[6]', '/html/body/section[1]/div/div[2]/a[6]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[6]/div[3]/span', feedback, page).then(a => {
        data.Drop6 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 7
    await getdrops('/html/body/section[1]/div/div[2]/a[7]', '/html/body/section[1]/div/div[2]/a[7]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[7]/div[3]/span', feedback, page).then(a => {
        data.Drop7 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 8
    await getdrops('/html/body/section[1]/div/div[2]/a[8]', '/html/body/section[1]/div/div[2]/a[8]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[8]/div[3]/span', feedback, page).then(a => {
        data.Drop8 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
    //Drop 9
    await getdrops('/html/body/section[1]/div/div[2]/a[9]', '/html/body/section[1]/div/div[2]/a[9]/div[1]/div/div[2]/div', '/html/body/section[1]/div/div[2]/a[9]/div[3]/span', feedback, page).then(a => {
        data.Drop9 = {Name: a.link, Item: a.Drop,  Status: a.Status}
    })
}

module.exports = {
    GetRustDrops
}