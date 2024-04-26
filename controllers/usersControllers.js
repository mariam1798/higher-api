const bcrypt = require("bcrypt");
require("dotenv").config();
const cloudinary = require("../utils/cloudinary");
const path = require("path");

const configuration = require("../knexfile");
const knex = require("knex")(configuration);

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    let filename = path.basename(file.originalname, ext).toLowerCase();

    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(
        new Error(
          "File type is not supported or filename does not start with 'Photo'"
        ),
        false
      );
    } else {
      cb(null, true);
    }
  },
});

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    location,
    professional_status,
    experience_years,
    job_title,
  } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !professional_status ||
    !experience_years ||
    !job_title
  ) {
    return res.status(401).json({ error: "please fill the required fields" });
  }

  const hashedPassword = bcrypt.hashSync(password, 6);
  let avatarUrl = "";
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });
    avatarUrl = result.secure_url;
  } catch (error) {
    console.error("Failed to upload avatar to Cloudinary:", error);
    return res.status(500).json({ error: "Failed to upload avatar" });
  }
  const newUser = {
    name,
    email,
    password: hashedPassword,
    professional_status,
    experience_years,
    location,
    job_title,
    avatar: avatarUrl,
  };

  try {
    await knex("users").insert(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "failed registeration" });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "please fill in required fields" });
  }
  try {
    const user = await knex("users").where({ email: email }).first();
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const passwordCorrect = bcrypt.compareSync(password, user.password);
    if (!passwordCorrect) {
      return res.status(400).json({ error: "incorrect password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Failed login" });
  }
};
const getUser = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Please login" });
  }
  const authToken = req.headers.authorization.split(" ")[1];
  if (!authToken || !process.env.JWT_SECRET) {
    return res.status(401).json({ error: "Auth token or secret is missing" });
  }
  try {
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    const userId = verified.id;

    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    return res.status(401).json({ error: "Invalid auth token" });
  }
};

const getUserVideos = async (req, res) => {
  const userId = req.params.userId;
  try {
    const users = await knex("videos").where("videos.user_id", userId);
    if (!users) {
      return res
        .status(404)
        .json({ message: `Could not find item with ID: ${userId}` });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};
const getUserDetails = async (req, res) => {
  const userId = req.params.userId;
  try {
    const users = await knex("users").where("users.id", userId).first();
    if (!users) {
      return res
        .status(404)
        .json({ message: `Could not find item with ID: ${userId}` });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await knex("users");
    if (!users) {
      return res.status(404).json({ message: `Could not find users` });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUserVideos,
  upload,
  getUserDetails,
  getUsers,
};
