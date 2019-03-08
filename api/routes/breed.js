const router = require('express').Router();
const {breed} = require('../utils/dogs');
const {selectBreed} = require('../utils/postgres');
const {rowsToSimple, rowsToRobust} = require('../utils/express_functions');
const {sanitize} = require('../utils/sanitation');

const limit = 10;

router.get('/:breed', (req, res) => {
    (async () => {
        const args = sanitize(req);
        console.log(args);

        if (!breed.includes(args.breed)) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'That breed does not exist'
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
                let result = await selectBreed(args);
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