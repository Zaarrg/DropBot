const data = require("../Data/SavedData")

async function MapDropsChecker(droppath, perecentpath, ttvlink, slectorpath, claimable, dropspage) {

    let checkdroppath = await dropspage.$(slectorpath);

    let checkclaim = await dropspage.$(claimable);

    if (await checkdroppath !== null) {
        const [precent] = await dropspage.$x(perecentpath);
        const percentcontent = await precent.getProperty('textContent')
        const rawprecent = await percentcontent.jsonValue();
        //Drop Item Name
        const [name] = await dropspage.$x(droppath);
        const namecontent = await name.getProperty('textContent')
        const nameraw = await namecontent.jsonValue();
        //ttv link
        const [link] = await dropspage.$x(ttvlink);
        const linkhref = await link.getProperty('href')
        const rawlink = await linkhref.jsonValue();

        data.dropsmap.push({name: nameraw.toString(), tvlink: rawlink, percent: Number(rawprecent), claim: false})
        return true;

    } else if (await checkclaim !== null){
        //Drop Item Name
        const [name] = await dropspage.$x(droppath);
        const namecontent = await name.getProperty('textContent')
        const nameraw = await namecontent.jsonValue();
        //ttv link
        const [link] = await dropspage.$x(ttvlink);
        const linkhref = await link.getProperty('href')
        const rawlink = await linkhref.jsonValue();

        data.dropsmap.push({name: nameraw.toString(), tvlink: rawlink, percent: 100, claim: true})
        return true;

    } else {
        return false;
    }
}

module.exports = {
    MapDropsChecker
}