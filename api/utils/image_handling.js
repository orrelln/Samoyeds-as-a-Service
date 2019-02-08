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

module.exports = {
    save: upload.single('photo')
};
