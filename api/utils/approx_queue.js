// approxLoad {Testing: 0.315, Production: 1.71}
const approxLoad = 1.71;

function approxTimeToMsg(curr, check) {
    const duration = (curr - check) * approxLoad;
    let str;
    switch (true) {
        case (duration <= 5):
            str = 'Less than 5 seconds';
            break;
        case (duration <= 30):
            str = 'Less than 30 seconds';
            break;
        case (duration <= 60):
            str = 'Less than a minute';
            break;
        case (duration <= 5 * 60):
            str = 'Less than 5 minutes';
            break;
        case (duration <= 30 * 60):
            str = 'Less than 30 minutes';
            break;
        default:
            str = 'More than 30 minutes';
            break;
    }
    return str;
}

module.exports = {
    approxTimeToMsg
};