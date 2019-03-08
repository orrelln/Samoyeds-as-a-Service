const router = require('express').Router();
const {selectId} = require('../utils/postgres');
const {rowsToSimple, rowsToRobust} = require('../utils/express_functions');
const {parse} = require('../utils/args_parser');

router.get('/:id', (req, res) => {
    let args = parse(req);

    if(!args.id) {
        res.status(404).json({
            status: 'error',
            code: '404',
            message: 'Invalid id format'
        });
    }
    else {
        (async () => {
            try {
                let result = await selectId(args);
                if (result) {
                    res.status(200).json({
                        status: 'success',
                        message:  args.robust ? rowsToRobust(result, req) : rowsToSimple(result, req)
                    });
                }
                else {
                    res.status(404).json({
                        status: 'error',
                        code: '404',
                        message: 'Id not found'
                    });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    status: 'error',
                    code: '500',
                    message: 'Internal Server Error, try again later.'
                });
            }
        })();
    }
});

exports.router = router;