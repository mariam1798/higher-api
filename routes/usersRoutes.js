const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
  addVideo,
  getVideosDetails,
  uploadVideo,
  getVideos,
} = require("../controllers/usersControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", getUser);
router.post("/videos", uploadVideo.single("file"), addVideo);
router.get("/videos", getVideos);
router.get("/videos/:videoId", getVideosDetails);

module.exports = router;
