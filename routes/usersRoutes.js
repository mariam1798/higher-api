const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUserVideos,
  upload,
} = require("../controllers/usersControllers");

router.post("/register", upload.single("file"), registerUser);

router.post("/login", loginUser);

router.get("/profile", getUser);
router.get("/:userId/videos", getUserVideos);

module.exports = router;
