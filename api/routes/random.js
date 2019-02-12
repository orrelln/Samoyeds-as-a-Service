const router = require('express').Router();
const {selectRandom} = require('../utils/postgres');

// Handles requests for random images
router.get('/', (req,res) => {
    (async () => {
        // Query DB for 'count' amount of dogs, up to 10
        let requested = isNaN(req.query.count) ? 1 : req.query.count;
        let count = !requested ? 1
                    : requested  > 10 ? 10
                    : requested;

        let result = await selectRandom(count);

        if(result==="error") {
            res.status(500).json(result);
        }
        else if(result.length < count) {
            res.status(206).json({
                success: result,
                warning: "Not enough images to fulfill request"
            });
        }
        else if(count < requested) {
            res.status(206).json({
                success: result,
                warning: "Maximum request size is 10"
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