const router = require('express').Router();
const {breed} = require('../utils/dogs');
const {selectBreed} = require('../utils/postgres');


router.get('/:breed', (req, res) => {
    (async () => {
        let requestedBreed = req.params.breed.toLowerCase();
        let count = isNaN(req.query.count) ? 1 : req.query.count;

        if (!breed.includes(requestedBreed)) {
            res.status(404).json({
                error: 'That breed does not exist'
            });
        }
        else if(count > 10) {
            res.status(403).json({
                error: "Too many images requested"
            });
        }
        else {
            try {
                let result = await selectBreed(breed, count);
                res.status(200).json({
                    success: result
                });
            }
            catch (err) {
                res.status(501).json(err);
            }
        }
    })();
});

exports.router = router;