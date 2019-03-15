const router = require('express').Router();
const {selectRecent} = require('../utils/postgres');
const {parse} = require('../utils/args_parser');
const {rowsToSimple, rowsToRobust} = require('../utils/express_functions');


const limit = 10;

// Handles requests for recent images
router.get('/', (req,res) => {
    (async () => {
        // Query DB for 'count' amount of dogs, up to 10
        const args = parse(req);

        if(args.count > limit) {
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
                let result = await selectRecent(args);
                const imgs = args.robust ? rowsToRobust(result, req) : rowsToSimple(result, req);

                const robust = args.robust ? '&robust=true' : '';
                const safe_mode = args.safe_mode ? '' : '&safe_mode=false';
                const next = `/recent?count=${args.count}&offset=${args.offset+args.count}${robust}${safe_mode}`;

                res.status(200).json({
                    status: 'success',
                    message: {
                        images: imgs,
                        next: next
                    }

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