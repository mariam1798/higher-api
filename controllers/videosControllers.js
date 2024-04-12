const bcrypt = require("bcrypt");
require("dotenv").config();

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const knex = require("knex")(configuration);

const jwt = require("jsonwebtoken");

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

const editVideo = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await knex("videos").where({ id: videoId }).first();

    video.likes++;

    const updatedVideo = await knex("videos")
      .where({ id: videoId })
      .update(video);

    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: `invalid video with ${videoId}` });
  }
};

module.exports = {
  addVideo,
  getVideos,
  editVideo,
  upload,
};
