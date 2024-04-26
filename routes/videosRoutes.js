const router = require("express").Router();
const {
  upload,
  getVideos,
  editVideo,
  addVideo,
  deleteVideos,
} = require("../controllers/videosControllers");

router.post("/", upload.single("file"), addVideo);
router.get("/", getVideos);
router.patch("/:videoId", editVideo);
router.delete("/:videoId", deleteVideos);
module.exports = router;
