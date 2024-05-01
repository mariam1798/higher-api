require("dotenv").config();

const configuration = require("../knexfile");
const knex = require("knex")(configuration);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

const getCommentById = async (commentId) => {
  try {
    return await knex("comments").where({ id: commentId }).first();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database error");
  }
};

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
  const videoId = req.params.videoId;

  let userId;
  try {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ error: "No token provided" });
    }

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
      avatar: user.avatar,
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

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ error: "No token provided" });
    }
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    const userId = verified.id;

    const comment = await getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    console.log(comment.user_id);
    if (comment.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await knex("comments").where({ id: commentId }).del();
    res.status(204).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  deleteComment,
  getCommentById,
  addComments,
  getComments,
  authenticateToken,
};
