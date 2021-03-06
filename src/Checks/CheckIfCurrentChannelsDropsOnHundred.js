const data = require("../Data/SavedData")
const {ciEquals} = require("../functions/util");

async function CheckIfCurrentChannelsDropsOnHundred() {

    let fullhundred = 0;
    let notequal = 0;

    for (let i = 0; i < data.choi.length; i++) {

        for (let d = 0; d < data.dropsmap.length; d++) {

            if (ciEquals(data.choi[i], data.dropsmap[d].tvlink)) {

                notequal = 0;

                if (data.dropsmap[d].percent === 100) {
                    fullhundred++;

                    if (fullhundred === data.choi.length) {

                        return true;

                    }

                } else {
                    return false
                }
            } else {

                notequal++;

                if (notequal === data.dropsmap.length) {
                    fullhundred++;
                }

            }
        }
    }
    return false
}

module.exports = {
    CheckIfCurrentChannelsDropsOnHundred
}