const router = module.exports = require('express').Router();

// Route to upload images
router.post('/upload', (req, res) => {
    res.status(200).json({
        Success: "Upload get!"
    })
});

// Any route with just numbers indicates user is accessing photo by ID
router.get('/[0-9]+$', (req, res) => {
    res.status(200).json({
        Success: "ID get!"
    })
});

// Any route with letters or underscores indicates user is accessing photo by breed
router.get('/[A-Za-z_]+$', (req, res) => {
    res.status(200).json({
        Success: "Breed get!"
    })
});
