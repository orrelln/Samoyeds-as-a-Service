const re = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$');

function parse(req) {
    return {
        id: (req.params.id && re.test(req.params.id)) ? req.params.id : null,
        breed: checkString(req.params.breed).toLowerCase(),
        category: checkString(req.params.category).toLowerCase(),
        count: checkNaturalNumber(req.query.count, 1),
        offset: checkNaturalNumber(req.query.offset, 0),
        percentage: checkPercentage(req.query.percentage, 0.75),
        safe_mode: checkBool(req.query.safe_mode, true),
        robust: checkBool(req.query.robust, false),
    }
}

function checkString(val) {
    return typeof(val) == 'string' && val.trim().length > 0 ? val.trim() : '';
}

function checkBool(val, def) {
    return val == null ? def : val === 'true' ? true : val === 'false' ? false : val;
}

function checkPercentage(val, def) {
    const floatVal = Number.parseFloat(val);
    return isNaN(floatVal) || floatVal < 0 || floatVal > 1 ? def : floatVal;
}

function checkNaturalNumber(val, def) {
    const numVal = Number.parseInt(val);
    return numVal > 0 ? numVal : def;
}

module.exports = {
    parse
};