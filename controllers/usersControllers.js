const bcrypt = require("bcrypt");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const knex = require("knex")(configuration);

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
  const newUser = {
    name,
    email,
    password: hashedPassword,
    professional_status,
    experience_years,
    location,
    job_title,
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
    const userId = verified.id; // Destructure for clarity

    // Fetch user
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    return res.status(401).json({ error: "Invalid auth token" });
  }
};
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadVideo = multer({
  storage: storage,
});
const getVideos = async (req, res) => {
  try {
    const videos = await knex("videos");
    if (!videos) {
      return res.status(404).json({ message: `Could not find videos` });
    }
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch videos" });
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

const addVideo = async (req, res) => {
  let userId;
  let user;

  try {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ error: "No token provided" });
    }

    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    userId = verified.id;
    user = await knex("users").where({ id: userId }).first();
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Invalid auth token" });
  }

  const { title, description } = req.body;
  let errors = {};
  if (req.fileError) {
    errors["video"] = req.fileError;
  }
  if (!title || !description) {
    return res.status(401).json({ error: "please fill video details" });
  }
  const newVideo = {
    title,
    description,
    views: 0,
    likes: 0,
    url: req.file.path,
    timestamp: Date.now(),
    user_id: userId,
    channel: user.name,
  };
  try {
    await knex("videos").insert(newVideo);
    res.json({ message: "video uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ error: "Invalid auth token or database error" });
  }
};

const getJobs = async (req, res) => {
  const title = req.params.title.replace(/-/g, "_").toLowerCase();
  const filePath = path.join(__dirname, "..", "data", `${title}.json`);
  const { location } = req.query;
  try {
    const data = await fs.readFile(filePath, "utf8");
    const jobs = JSON.parse(data);

    const filteredJobs = jobs.filter((job) =>
      job.countries.some(
        (country) => country.name.toLowerCase() === location.toLowerCase()
      )
    );

    res.json(filteredJobs);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(404).send("Job data not found");
    } else {
      res.status(500).send("An error occurred while processing your request");
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUserVideos,
  addVideo,
  uploadVideo,
  getVideos,
  getJobs,
};
