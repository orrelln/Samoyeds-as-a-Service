const re = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$');

function sanitize(req) {
    return {
        id: (req.params.id && re.test(req.params.id)) ? req.params.id : null,
        breed: checkString(req.params.breed).toLowerCase(),
        category: checkString(req.params.category).toLowerCase(),
        count: checkNumber(req.query.count, 1),
        percentage: checkNumber(req.query.percentage, 0.75),
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

function checkNumber(val, def) {
    return isNaN(val) ? def : val;
}

module.exports = {
    sanitize
};