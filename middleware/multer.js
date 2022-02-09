const multer = require("multer");

const customStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
    }
})
module.exports = { customStorage };