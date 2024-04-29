const router = require("express").Router();
const {
  upload,
  getVideo,
  getVideos,
  editVideo,
  addVideo,
  deleteVideos,
  deleteLike,
} = require("../controllers/videosControllers");

router.post("/", upload.single("file"), addVideo);
router.get("/", getVideos);
router.get("/:videoId", getVideo);
router.patch("/:videoId", editVideo);
router.delete("/:videoId", deleteVideos);
module.exports = router;
