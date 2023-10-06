const express = require("express");
const Joi = require("joi");
const { authenticateUser } = require("../models/mysql_model/user_model");

const router = express.Router();

router.post("/", async (req, res) => {
  const result = await authenticateUser(req.body);
  res
    .status(200)
    .header({ x_authToken: result.x_authToken })
    .send(result.message);
});

const authJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
});

function validateAuth(auth) {
  return authJoiSchema.validate(auth);
}

module.exports = router;
