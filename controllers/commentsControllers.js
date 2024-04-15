require("dotenv").config();

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const knex = require("knex")(configuration);

const getComments = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const comments = await knex("comments").where({ video_id: videoId });
    if (comments.length === 0) {
      return res.status(200).json([]);
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

const jwt = require("jsonwebtoken");

const addComments = async (req, res) => {
  const { comment } = req.body;
  const authToken = req.headers.authorization?.split(" ")[1];
  const videoId = req.params.videoId;

  if (!authToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  let userId;
  try {
    console.log(authToken);
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    userId = verified.id;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    const user = await knex("users").where({ id: userId }).first();
    const video = await knex("videos").where({ id: videoId }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!comment) {
      return res.status(400).json({ error: "Please fill in comment" });
    }

    const newComment = {
      name: user.name,
      // avatar: user.avatar,
      comment,
      timestamp: Date.now(),
      user_id: userId,
      video_id: videoId,
    };

    await knex("comments").insert(newComment);
    res.status(200).json({ message: "Comment uploaded successfully" });
  } catch (error) {
    console.error("Database or JWT Error:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  addComments,
  getComments,
};
