import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/blogs", auth, upload.single("image"), createBlog);
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getSingleBlog);
router.patch("/blogs/:id", auth, upload.single("image"), updateBlog);
router.delete("/blogs/:id", auth, deleteBlog);

export default router;
