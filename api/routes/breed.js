const router = require('express').Router();
const {breed} = require('../utils/dogs');

router.get('/:breed', (req, res) => {
    let breed = req.params.breed.toLowerCase();

    if (!breed.includes(breed)) {
        res.status(404).json({
            error: 'That breed does not exist'
        });
    }
    else {
        res.status(200).json({
            Success: `Breed ${breed} get!`
        });
    }
});

exports.router = router;