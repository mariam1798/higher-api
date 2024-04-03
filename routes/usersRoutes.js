const router = require("express").Router();
const bcrypt = require("bcrypt");
require("dotenv").config();

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const knex = require("knex")(configuration);

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    professional_status,
    experience_years,
    job_title,
  } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !professional_status ||
    !experience_years ||
    job_title
  ) {
    return res.status(401).json({ error: "please fill the required fields" });
  }
  const hashedPassword = bcrypt.hashSync(password, 6);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    professional_status,
    experience_years,
    job_title,
  };

  try {
    await knex("users").insert(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "failed registeration" });
  }
});
module.exports = router;
