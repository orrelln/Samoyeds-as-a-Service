const multer = require('multer');
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const imageTypes = ['image/jpeg', 'image/png'];


const storage = multer.diskStorage (
    {
        destination: function (req, file, cb) {
            cb(null, '/temp')
        },
        filename: function (req, file, cb) {
            const newFilename = `${uuid()}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        }
    }
);

const upload = multer({
    destination: '/temp',
    storage: storage,
    limits: {fileSize: 20000000, files:1},
    fileFilter: function (req, file, cb) {
        if (file && imageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            return cb(null, false);
        }
    }
});

function moveFile(from, to) {
    const source = fs.createReadStream(from);
    const dest = fs.createWriteStream(to);

    return new Promise((resolve, reject) => {
        source.on('end', resolve);
        source.on('error', reject);
        source.pipe(dest);
    });
}

module.exports = {
    save: upload.single('photo'),
    moveFile
};
