const router = require('express').Router();
const {selectRandom} = require('../utils/postgres');

// Handles requests for random images
router.get('/', (req,res) => {
    (async () => {
        // Query DB for 'count' amount of dogs, up to 10
        let count = isNaN(req.query.count) ? 1 : req.query.count;

        if(count > 10) {
            res.status(403).json({
                error: "Too many images requested"
            });
        }
        else {
            let result = await selectRandom(count);

            if (result === "error") {
                res.status(500).json(result);
            }
            else {
                res.status(200).json({
                    success: result
                });
            }

        }

    })();
});

exports.router = router;