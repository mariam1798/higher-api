const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
  addVideo,
  getUserVideos,
  uploadVideo,
  getVideos,
  getJobs,
  editVideo,
} = require("../controllers/usersControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", getUser);
router.post("/videos", uploadVideo.single("file"), addVideo);
router.get("/videos", getVideos);
router.get("/:userId/videos", getUserVideos);
router.get("/job/:title", getJobs);
router.patch("/videos/:videoId", editVideo);

module.exports = router;
