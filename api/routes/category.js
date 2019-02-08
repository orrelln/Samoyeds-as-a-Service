const router = require('express').Router();
const {category} = require('../utils/dogs');

router.get(`/:category`, (req, res) => {
    let category = req.params.category.toLowerCase();

    if (!category.includes(category)) {
        res.status(404).json({
            error: 'That category does not exist'
        });
    }
    else {
        res.status(200).json({
            Success: `Category ${category} get!`
        });
    }
});

exports.router = router;