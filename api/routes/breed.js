const router = require('express').Router();
const {breed} = require('../utils/dogs');
const {selectBreed} = require('../utils/postgres');
const {idToImgPath} = require('../utils/express_functions');

const limit = 10;

router.get('/:breed', (req, res) => {
    (async () => {
        let requestedBreed = req.params.breed.toLowerCase();
        let count = isNaN(req.query.count) ? 1 : req.query.count;

        if (!breed.includes(requestedBreed)) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'That breed does not exist'
            });
        }
        else if(count > limit) {
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
                let result = await selectBreed(requestedBreed, count);
                res.status(200).json({
                    status: 'success',
                    message: idToImgPath(result, req)
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