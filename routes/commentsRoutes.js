const router = require("express").Router();
const {
  addComments,
  getComments,
} = require("../controllers/commentsControllers");

router.get("/:videoId", getComments);
router.post("/:videoId", addComments);

module.exports = router;
