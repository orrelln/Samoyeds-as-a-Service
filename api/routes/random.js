const router = require('express').Router();
const {selectRandom} = require('../utils/postgres');

// Handles requests for random images, up to 10
router.get('/', (req,res) => {
    (async () => {

        let count = req.query.count || 1;

        if (count > 10) {
            res.status(400).json({
                error: "You cannot request that many images"
            });
        }

        // Query DB for 'count' amount of dogs
        let result = await selectRandom(count);

        if(result==="error") {
            res.status(500).json(result);
        }
        else if(result.length < count) {
            res.status(400).json({
                error: "we don't have enough doggos :("
            });
        }
        else {
            res.status(200).json({
                success: result
            });
        }

    })();
});

exports.router = router;