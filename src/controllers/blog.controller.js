import cloudinary from "../config/cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { isValidUpdate } from "../utils/is-valid-update.js";

  // @desc Create blog
  // @route POST /blogs
  // @access Private (author, admin)
  export const createBlog = async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "blog-images",
              transformation: {
                width: 1200,
                height: 630,
                crop: "fill",
                format: "auto",
              },
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      const blog = await Blog.create({
        title,
        description,
        imageURL: result.secure_url,
        imagePublicId: result.public_id,
        author: req.user._id,
      });

      res.status(201).json({
        success: true,
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  // @desc Get all blogs
  // @route GET /blogs
  // @access Public
  export const getBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find({}).populate("author");
      res.status(200).json({
        success: true,
        blogs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  // @desc Get single blog
  // @route GET /blogs/:id
  // @access Public
  export const getSingleBlog = async (req, res) => {
    try {
      const _id = req.params.id;
      const blog = await Blog.findById({ _id }).populate("author");
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found.",
        });
      }
      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  // @desc Update blog
  // @route PATCH /blogs/:id
  // @access Private (author, admin)
  export const updateBlog = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      if (req.file) {
        if (blog.imagePublicId) {
          await cloudinary.uploader.destroy(blog.imagePublicId);
        }
        // upload new image
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "blog-images" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(req.file.buffer);
        });

        blog.imageURL = result.secure_url;
        blog.imagePublicId = result.public_id;
      }

      // update title & description
      blog.title = req.body.title || blog.title;
      blog.description = req.body.description || blog.description;

      await blog.save();

      res.json({
        success: true,
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  // @desc Delete blog
  // @route DELETE /blogs/:id
  // @access Private (author, admin)
  export const deleteBlog = async (req, res) => {
    try {
      const filter =
        req.user.role === "admin"
          ? { _id: req.params.id }
          : { _id: req.params.id, author: req.user._id };

      const blog = await Blog.findOneAndDelete(filter).populate("author");

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found.",
        });
      }

      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }

      res.json({
        success: true,
        message: "Blog post successfully delete",
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
