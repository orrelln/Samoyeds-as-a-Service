const router = require('express').Router();
const {selectId} = require('../utils/postgres');
const re = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$');

router.get('/:id', (req, res) => {
    let id = req.params.id;

    if(!re.test(id)) {
        res.status(404).json({
            error: 'invalid ID'
        });
    }
    else {
        (async () => {
            try {
                let result = await selectId(id);
                res.status(200).json({
                    success: result
                });
            }
            catch (err) {
                res.status(501).json(err);
            }
        })();
    }

});

exports.router = router;