const router = require('express').Router();
const re = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$');

router.get('/:id', (req, res) => {
    let id = req.params.id;

    if(!re.test(id)) {
        res.status(404).json({
            error: 'invalid ID'
        });
    }
    else {
        res.status(200).json({
            Success: "ID get!",

        });
    }

});

exports.router = router;