const data = require("../Data/SavedData");
const chalk = require("chalk");
const winston = require("winston");

async function MapDrops(dropspage) {
    await dropspage.reload({
        waitUntil: ["networkidle2", "domcontentloaded"]
    })
    data.dropsmap = [];
    await parseTwitchDropsPage(dropspage).then(r => {
        data.dropsmap = r[0];
        data.claimed = r[1];

        if (r[2].length > 0 ) {
            r[2].forEach(e => {
                winston.info(chalk.gray("Claimed Drop: ") + chalk.white(e.DropName));
            })
        }
    })
}

async function parseTwitchDropsPage(dropspage) {
    if (data.debug) winston.info(chalk.gray("Waiting for Dropspage to load (WaitForSelector)"));
    let elementexists = await dropspage.evaluate(() => {
        let el = document.querySelector("[data-test-selector=\"DropsCampaignInProgressRewards-container\"]")
        return el ? el.innerText : ""
    })
    if (elementexists !== "") {
        try { await dropspage.waitForSelector('[data-test-selector="DropsCampaignInProgressRewards-container"]'); } catch (e) {winston.info(chalk.yellow('WARNING: No Twitch Drops found in your inventory...'))}
    } else { winston.info(chalk.gray('No Twitch Drops to progress found in your inventory...')) }

    await dropspage.addScriptTag({url: 'https://code.jquery.com/jquery-3.6.0.js'})
    let autoclaimstatus = data.settings.AutoClaim
    return dropspage.evaluate((autoclaimstatus) => {
        let activedrops = [];
        let claimeddrops = [];

        const dropsinfo = $(".inventory-campaign-info");
        const drops = $('[data-test-selector="DropsCampaignInProgressRewards-container"]');
        //Push all Claimed Drops to List
        const ClaimedDrops = $('[data-test-selector="awarded-drop__drop-name"]');
        ClaimedDrops.each((index, element) => claimeddrops.push($(element).text().toString()))

        const urls = [];
        const names = [];
        const progress = [];
        //Get Twitch Url
        dropsinfo.each((index, element) => {
            const $element = $(element);

            const url = $element.find('[data-test-selector="DropsCampaignInProgressDescription-single-channel-hint-text"]').first().attr("href");
            if (url === undefined || url === null) {
                const url = $element.find('[data-test-selector="DropsCampaignInProgressDescription-two-channels-hint-text"]').first().attr("href");
                if (url === undefined || url === null) {
                    const url = $element.find('[data-test-selector="DropsCampaignInProgressDescription-no-channels-hint-text"]').first().attr("href");
                    urls.push(url);
                } else {
                    urls.push(url);
                }
            } else {
                urls.push(url);
            }
        });
        //Get Progress and Name
        drops.each((index, element) => {
            const $element = $(element);
            const droppercentage = $element.find('[data-a-target="tw-progress-bar-animation"]').first().attr("value");
            const name = $element.find('p').first().text();

            progress.push(parseInt(droppercentage));
            names.push(name.toString())
        })
        //Map Progress Name and url to one object and push it
        urls.forEach((element, index) => {
            activedrops.push({
                url: element,
                name: names[index],
                percentage: progress[index]
            })
        })
        //Filter the Gloabl Drops Out
        //Temp fix -> No Active Drops and Active Drops but not Rust have to filter it...
        if (activedrops.length > 0) {
            try {
                activedrops = activedrops.filter((item) => {
                    return item.url.startsWith('https://www.twitch.tv')
                })
            } catch (e) {

            }
        }
        //Auto Claim
        let clickedelements = []
        if (autoclaimstatus) {
            drops.each((index, element) => {
                const $element = $(element);
                if ($element.find('[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]').length > 0) {
                    const name = $element.find('p').first().text();
                    $element.find('[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]').click();
                    clickedelements.push({DropName: name})
                }
            })
        }
        return [activedrops, claimeddrops, clickedelements];
    }, autoclaimstatus);
}

module.exports = {
    MapDrops,
    parseTwitchDropsPage
}