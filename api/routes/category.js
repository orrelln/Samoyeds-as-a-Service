const router = require('express').Router();
const {category} = require('../utils/dogs');
const {sanitize} = require('../utils/sanitation');


router.get(`/:category`, (req, res) => {
    let args = sanitize(req);

    if (!category.includes(args.category)) {
        res.status(404).json({
            status: 'error',
            code: '404',
            message: 'That category does not exist'
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            message: `Category ${args.category} get!`
        });
    }
});

exports.router = router;