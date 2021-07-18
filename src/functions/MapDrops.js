const data = require("../Data/SavedData");

async function MapDrops(dropspage) {
    await dropspage.reload({
        waitUntil: ["networkidle2", "domcontentloaded"]
    })
    data.dropsmap = [];

    //Inject JQuery DropsPage from Rust
    async function injectJQuery() {
        await dropspage.addScriptTag({
            path: require.resolve("jquery")
        })
    }

    await injectJQuery()



    async function parseTwitchDropsPage(dropspage) {

        return dropspage.evaluate(() => {
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
            activedrops = activedrops.filter((item) => {
                return item.url.startsWith('https://www.twitch.tv')
            })



            return [activedrops, claimeddrops];
            //
        });
    }

    await parseTwitchDropsPage(dropspage).then(r => {
        data.dropsmap = r[0];
        data.claimed = r[1];
    })


}


module.exports = {
    MapDrops
}