import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //since in request the file also coming so we using multer to handle file normal in req res there is not that file  thing normally
    cb(null, "./public/test"); //initially storing on server public dir small time upto the upload time  then rm it
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
