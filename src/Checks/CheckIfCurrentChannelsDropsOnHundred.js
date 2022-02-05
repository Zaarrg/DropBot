const data = require("../Data/SavedData")
const {ciEquals} = require("../functions/util");

async function CheckIfCurrentChannelsDropsOnHundred() {
    let chswith100 = 0;

    data.dropsmap.forEach((element, index) => {
        data.choi.forEach((e, i) => {
            if(element.url === e) {
                if(element.percentage === 100) {
                    chswith100++
                }
            }
        })
    })
    return chswith100 === data.choi.length;
}

module.exports = {
    CheckIfCurrentChannelsDropsOnHundred
}