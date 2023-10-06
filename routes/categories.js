const express = require("express");

const auth = require("../middleware/authentication");

const {
  addNewCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../models/mysql_model/category_model");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  const result = await getAllCategories(req.user);
  res.status(result.statusCode).send(result.message);
});

router.post("/", async (req, res) => {
  const result = await addNewCategory(req.body, req.user);
  res.status(result.statusCode).send(result.message);
});

router.put("/:id", async (req, res) => {
  const result = await updateCategory(req.params.id, req.body);
  res.status(result.statusCode).send(result.message);
});

router.delete("/:id", async (req, res) => {
  const result = await deleteCategory(req.params.id);
  res.status(result.statusCode).send(result.message);
});

module.exports = router;
