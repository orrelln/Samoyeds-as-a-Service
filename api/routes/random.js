const router = require('express').Router();

router.get('/', (req,res) => {
    res.status(200).json({
        Success: 'Implementation coming soon'
    })
});

exports.router = router;