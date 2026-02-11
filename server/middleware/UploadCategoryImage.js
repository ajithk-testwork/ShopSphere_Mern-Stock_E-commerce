import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/categoryImages",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadCategoryImage = multer({ storage });

export default uploadCategoryImage;
