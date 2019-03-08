const router = require('express').Router();
const {category} = require('../utils/dogs');
const {parse} = require('../utils/args_parser');


router.get(`/:category`, (req, res) => {
    let args = parse(req);

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