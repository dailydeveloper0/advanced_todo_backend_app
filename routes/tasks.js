const express = require("express");

const {
  addNewTask,
  updateTask,
  deleteTask,
  getAllTasks,
} = require("../models/mysql_model/task_model");

const auth = require("../middleware/authentication");


const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  const result = await getAllTasks(req.body);

  res.status(result.statusCode).send(result.message);
});

router.post("/", async (req, res) => {
  const result = await addNewTask(req.body);
  res.status(result.statusCode).send(result.message);
});

router.put("/:id", async (req, res) => {
  const result = await updateTask(req.params.id, req.body);
  res.status(result.statusCode).send(result.message);
});

router.delete("/:id", async (req, res) => {
  const result = await deleteTask(req.params.id);
  res.status(result.statusCode).send(result.message);
});

module.exports = router;
