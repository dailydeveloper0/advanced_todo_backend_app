const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: {
    type: String,
    required: true,
    trim: true,
  },
  subTask: {
    type: [String],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  remindeOn: {
    type: Date,
  },
  isCompeleted: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Schema.ObjectId,
  },
  order: {
    type: Number,
  },
});

const Task = mongoose.model("Task", taskSchema);

const taskJoiSchema = Joi.object({
  task: Joi.string().required(),
  subTask: Joi.array(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  remindeOn: Joi.date(),
  isCompeleted: Joi.bool(),
  category: Joi.string(),
  order: Joi.number(),
});

function validateTask(task) {
  return taskJoiSchema.validate(task);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;
