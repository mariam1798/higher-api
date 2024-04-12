const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/usersRoutes");
const videosRoutes = require("./routes/videosRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/videos", videosRoutes);
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
