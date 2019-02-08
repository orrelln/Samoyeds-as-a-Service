const router = module.exports = require('express').Router();
const multer = require('multer');
const uuid = require('uuid/v4');
const path = require('path');



const imageTypes = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage (
    {
        destination: function (req, file, cb) {
            cb(null, './i')
        },
        filename: function (req, file, cb) {
            const newFilename = `${uuid()}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        }
    }
);

const upload = multer({
    destination: __dirname + '/../i/',
    storage: storage,
    limits: {fileSize: 20000000, files:1},
    fileFilter: function (req, file, cb) {
        if (file && imageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        return cb(null, false, new Error('Faulty mimetype'));
    }
});

const saveImage = upload.single('photo');
// Route to upload images
router.post('/upload', (req, res) => {
    saveImage(req, res, function (err) {
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
