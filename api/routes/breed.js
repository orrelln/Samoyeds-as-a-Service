const router = require('express').Router();
const {breed} = require('../utils/dogs');
const {selectBreed} = require('../utils/postgres');


router.get('/:breed', (req, res) => {
    (async () => {
        let requestedBreed = req.params.breed.toLowerCase();
        if (!breed.includes(requestedBreed)) {
            res.status(404).json({
                error: 'That breed does not exist'
            });
        }
        else {
            try {
                let result = await selectBreed(breed);
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