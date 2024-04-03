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
    location,
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
    !job_title
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
    location,
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "please fill in required fields" });
  }
  try {
    const user = await knex("users").where({ email: email }).first();
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const passwordCorrect = bcrypt.compareSync(password, user.password);
    if (!passwordCorrect) {
      return res.status(400).json({ error: "incorrect password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Failed login" });
  }
});

router.get("/profile", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Please login" });
  }
  const authToken = req.headers.authorization.split(" ")[1];
  if (!authToken || !process.env.JWT_SECRET) {
    return res.status(401).json({ error: "Auth token or secret is missing" });
  }
  try {
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    if (verified) {
      const { id } = verified;
      const user = await knex("users").where({ id }).first();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid auth token" });
  }
});

module.exports = router;
