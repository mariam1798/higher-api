const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUserVideos,
  getUserDetails,
  getUsers,
  upload,
} = require("../controllers/usersControllers");

router.post("/register", upload.single("file"), registerUser);

router.post("/login", loginUser);

router.get("/profile", getUser);
router.get("/:userId/videos", getUserVideos);
router.get("/:userId", getUserDetails);
router.get("/", getUsers);

module.exports = router;
