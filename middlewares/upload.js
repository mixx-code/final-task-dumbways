import multer from "multer";

const storagePath = process.env.NODE_ENV === "production" ? "/tmp" : "uploads/";

const upload = multer({ dest: storagePath });

export default upload;
