// approxLoad {Testing: 0.315, Production: 1.71}
let _queueInfo = {
    approxCount: 0,
    approxLoad: 1.94,
    lastCheck: null,
    timeTilCheck: null,
    timeTilCheckLength: 5 * 60
};

function getApproxQueueTime() {
    const now = Date.now() / 1000;
    _queueInfo.approxCount += 1;

    if(!_queueInfo.lastCheck) {
        _queueInfo.lastCheck = Date.now() / 1000;
        _queueInfo.timeTilCheck = _queueInfo.lastCheck + _queueInfo.timeTilCheckLength;
    }

    const approxTime = Math.max((_queueInfo.approxCount *
        _queueInfo.approxLoad + (_queueInfo.lastCheck - now)), 0);

    if(now > _queueInfo.timeTilCheck) {
        _queueInfo.lastCheck = now;
        _queueInfo.approxCount = Math.max(
            0, Math.floor(approxTime / _queueInfo.approxLoad));
        _queueInfo.timeTilCheck = now + _queueInfo.timeTilCheckLength
    }

    return approxTime;
}

function approxTimeToMsg(duration) {
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
    getApproxQueueTime,
    approxTimeToMsg
};