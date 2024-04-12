const router = require("express").Router();
const {
  upload,
  getVideos,
  editVideo,
  addVideo,
} = require("../controllers/videosControllers");

router.post("/", upload.single("file"), addVideo);
router.get("/", getVideos);
router.patch("/:videoId", editVideo);
module.exports = router;
