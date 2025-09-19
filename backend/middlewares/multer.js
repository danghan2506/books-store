import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, os.tmpdir());
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const safeName = file.originalname || "upload";
        callback(null, uniqueSuffix + "-" + safeName);
    },
});

const upload = multer({ storage });
export default upload