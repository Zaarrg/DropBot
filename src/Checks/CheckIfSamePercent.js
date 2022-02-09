let PercentChecker = false;
let LastPercent;
let SamePercent = 0;

async function SamePercentCheck(PercentCurrentDrop) {

    if (PercentChecker === false) {
        PercentChecker = true;
        LastPercent = PercentCurrentDrop;
        return false;

    } else if (PercentChecker === true) {
        if (LastPercent === PercentCurrentDrop) {
            SamePercent++;

        } else if (LastPercent !== PercentCurrentDrop) {
            LastPercent = PercentCurrentDrop;
            SamePercent = 0;
        }

        if (SamePercent === 4) {
            SamePercent = 0;
            PercentChecker = false;
            return true;
        }
        return false;
    }
    return false;
}

module.exports = {
    SamePercentCheck
}