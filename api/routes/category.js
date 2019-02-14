const router = require('express').Router();
const {category} = require('../utils/dogs');

router.get(`/:category`, (req, res) => {
    let category = req.params.category.toLowerCase();

    if (!category.includes(category)) {
        res.status(404).json({
            status: 'error',
            code: '404',
            message: 'That category does not exist'
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            message: `Category ${category} get!`
        });
    }
});

exports.router = router;