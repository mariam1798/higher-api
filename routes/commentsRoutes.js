const router = require("express").Router();
const {
  addComments,
  getComments,
  getCommentById,
  deleteComment,
  authenticateToken,
} = require("../controllers/commentsControllers");

router.get("/:videoId", getComments);
router.post("/:videoId", addComments);
router.get("/comment/:commentId", getCommentById);
router.delete("/:commentId", authenticateToken, deleteComment);

module.exports = router;
