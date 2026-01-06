import { User } from "../models/user.model.js";
import { isValidUpdate } from "../utils/is-valid-update.js";

// @desc   Create new user
// @route  POST /api/auth/sign-up
// @access Public
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = await user.generateAuthToken();

    res.status(201).json({
      message: "User successfully created.",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Logout user
// @route  POST /api/auth/logout
// @access Private
export const logout = async (req, res) => {
  try {
    const { user, token } = req;
    user.tokens = user.tokens.filter((t) => t === token);
    user.save();

    res.status(200).json({
      message: "User logout successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email or password are required.",
      });
    }

    const user = await User.isValidUser(email, password);
    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// @desc Get own profile
// @route GET /api/auth/my-profile
// @access Private
export const myProfile = async (req, res) => {
  const { user } = req;
  try {
    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Logout all sessions
// @route POST /api/auth/logout-all
// @access Private
export const logoutAll = async (req, res) => {
  try {
    const { user } = req;
    user.tokens = [];
    user.save();
    res.status(200).json({
      success: true,
      message: "Successfully logout from all devices.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin Routes
export const getUsers = async (req, res) => {
  try {
    const authors = await User.find({ role: "author" }).populate("blogs");
    res.json({
      success: true,
      authors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const author = await User.findById(req.params.id).populate("blogs");

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    res.json({
      success: true,
      author,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!isValidUpdate(["name", "password"], req.body)) {
      return res.status(401).json({
        success: false,
        message: "Invalid update.",
      });
    }

    const author = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!author) {
      return res.status(404).json({
        success: true,
        message: "Author not found.",
      });
    }

    res.json({
      success: true,
      message: "Author updated sucessfully.",
      author,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const author = await User.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    res.json({
      success: true,
      message: "Author deleted successfully",
      author,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
