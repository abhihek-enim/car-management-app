import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //  destination folder for uploaded files
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    //  filename for the uploaded file

    cb(null, file.originalname);
  },
});

// Create the upload middleware
export const upload = multer({ storage: storage });
