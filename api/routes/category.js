const router = require('express').Router();
const {category} = require('../utils/dogs');
const {selectCategory} = require('../utils/postgres');
const {rowsToSimple, rowsToRobust} = require('../utils/express_functions');
const {parse} = require('../utils/args_parser');

const limit = 10;

router.get(`/:category`, (req, res) => {
    (async () => {
        let args = parse(req);

        if (!category.includes(args.category)) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'That category does not exist'
            });
        }
        else if(args.count > limit) {
            res.status(403).json({
                status: 'error',
                code: '403',
                message: {
                    info: "Too many images requested",
                    limit: limit
                }
            });
        }
        else {
            try {
                let result = await selectCategory(args);
                res.status(200).json({
                    status: 'success',
                    message: args.robust ? rowsToRobust(result, req) : rowsToSimple(result, req)
                });
            }
            catch (err) {
                res.status(500).json({
                    status: 'error',
                    code: '500',
                    message: 'Internal Server Error, try again later.'
                });
            }
        }
    })();
});

exports.router = router;