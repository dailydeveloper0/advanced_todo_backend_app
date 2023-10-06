const express = require("express");
const auth = require("../middleware/authentication");
const {isAdmin} = require("../middleware/authorization");

const {
  register,
  update,
  getAllUsers,
  validateNewUser,
  validateUpdateUser,
} = require("../models/mysql_model/user_model");
const router = express.Router();

router.get("/",auth,isAdmin, async (req, res) => {
  try {
    const result = await getAllUsers();
    res.status(result.statusCode).send(result.message);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unknow error occured. Please try agian");
  }
});

router.post("/register", async (req, res) => {
  const { error } = validateNewUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const result = await register(req.body);
    res.status(result.statusCode).send(result.message);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unknow error occured. Please try agian");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const result = await update(req.body, req.params.id);
    res.status(result.statusCode).send(result.message);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unknow error occured. Please try agian");
  }
});

module.exports = router;
