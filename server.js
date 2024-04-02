const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Read ENV config
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

//Set up CORS access and JSON convention
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
