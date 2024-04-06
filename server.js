const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/usersRoutes");

// Read ENV config
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Set up CORS access and JSON convention
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("file"), function (req, res, next) {
  console.log("test");
  res.send("successful!");
});

app.use(express.static("public"));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
