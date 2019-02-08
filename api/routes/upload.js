const router = require('express').Router();
const image_handling = require('../utils/image_handling');


router.post('/', (req, res) => {
    image_handling.save(req, res, function (err) {
        if (err) {
            res.status(400).json({
                error: "Request doesn't contain a valid png or jpeg."
            });
        }
        else {
            res.status(200).json({
                UUID: req.file.filename
            })
        }
    });

});

exports.router = router;