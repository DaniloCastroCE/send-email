import express from "express";
import multer from "multer"
import { sendEmail } from "../controllers/routes/post.js";
import { home, help } from "../controllers/routes/get.js"
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", home)
router.get("/help", help)
router.post("/send-email", upload.array('files'), sendEmail)

export default router