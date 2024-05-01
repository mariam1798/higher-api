const bcrypt = require("bcrypt");
require("dotenv").config();
const cloudinary = require("../utils/cloudinary");

const configuration = require("../knexfile");
const knex = require("knex")(configuration);

const jwt = require("jsonwebtoken");

const fileFilter = (req, file, cb) => {
  if (file.originalname.match(/\.(mov|mp4)$/)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only .mov and .mp4 files are allowed!"),
      false
    );
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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
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
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ error: "Please fill in video details" });
  }

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
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Invalid auth token" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No video file uploaded" });
  }
  if (!req.file.originalname.match(/\.(mov|mp4)$/)) {
    return res.status(400).json({
      error: "Invalid file type, only .mov and .mp4 files are allowed",
    });
  }
  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error uploading video to Cloudinary" });
  }

  const newVideo = {
    title: req.body.title,
    description: req.body.description,
    url: result.secure_url,
    cloudinary_id: result.public_id,
    timestamp: Date.now(),
    user_id: userId,
    channel: user.name,
    avatar: user.avatar,
  };

  try {
    await knex("videos").insert(newVideo);
    res.json({ message: "Video uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Database error" });
  }
};
const editVideo = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await knex("videos").where({ id: videoId }).first();

    video.likes++;

    await knex("videos").where({ id: videoId }).update(video);

    const updatedVideo = await knex("videos").where({ id: videoId }).first();

    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: `invalid video with ${videoId}` });
  }
};
const deleteVideos = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const cloudinary_id = await knex("videos")
      .select("cloudinary_id")
      .where("id", videoId)
      .first();

    if (!cloudinary_id) {
      return res
        .status(404)
        .json({ message: `Video with ID ${videoId} not found` });
    }

    await cloudinary.uploader.destroy(cloudinary_id);

    const rowsDeleted = await knex("videos").where("id", videoId).delete();
    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `video with ID ${videoId} not found` });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete video ${error}`,
    });
  }
};
const getVideo = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await knex("videos").where({ id: videoId }).first();
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch video with id ${videoId}` });
  }
};

module.exports = {
  addVideo,
  getVideo,
  getVideos,
  editVideo,
  deleteVideos,
  upload,
};
