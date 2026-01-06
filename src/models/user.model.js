import { model, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// This will be cleaned
import dotenv from "dotenv";
import { Blog } from "./blog.model.js";
dotenv.config();
const jsonSecretKey = process.env.JSON_SECRET_KEY;
//

export const ROLES = {
  AUTHOR: "author",
  ADMIN: "admin",
};

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.AUTHOR,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timeStamps: true }
);

userSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "author",
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, jsonSecretKey);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.isValidUser = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unauthorized");
  }

  return user;
};

userSchema.pre("findOneAndDelete", async function (next) {
  const query = this.getQuery();
  if (query._id) {
    await Blog.deleteMany({ author: query._id });
  }
  next();
});

export const User = model("User", userSchema);
