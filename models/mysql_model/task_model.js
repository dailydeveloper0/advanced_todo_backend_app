const {
  sequelize,
  DataTypes,
  Model,
} = require("../../helpers/mysqldb_connect");
const Joi = require("joi");
var res = { statusCode: 0, message: "" };

const Task = sequelize.define("tasks", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  task: {
    type: DataTypes.TEXT("tiny"),
    allowNull: false,
  },
  subTask: {
    type: DataTypes.JSON,
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  remindType: {
    type: DataTypes.ENUM(
      "daily",
      "weekly",
      "monthly",
      "specificTime",
      "specificDay"
    ),
    allowNull: true,
  },
  repeatRemind: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  remindeOn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isCompeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

const taskJoiSchema = Joi.object({
  task: Joi.string().required(),
  subTask: Joi.array(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  remindType: Joi.string().valid(
    "daily",
    "weekly",
    "monthly",
    "specificTime",
    "specificDay"
  ),
  repeatRemind: Joi.bool(),
  remindeOn: Joi.date(),
  isCompeleted: Joi.bool(),
  categoryID: Joi.string(),
  order: Joi.number(),
});

function validateTask(task) {
  return taskJoiSchema.validate(task);
}
async function getAllTasks(obj) {
  try {
    const tasks = await Task.findAll({ where: { categoryID: obj.categoryID } });
    res.statusCode = 200;
    res.message = tasks;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}
async function addNewTask(obj) {
  try {
    const { error } = validateTask(obj);
    if (error) {
      res.statusCode = 400;
      res.message = error.details[0].message;
      return res;
    }
    const task = await Task.create({
      task: obj.task,
      subTask: obj.subTask,
      remindType: obj.remindType,
      repeatRemind: obj.repeatRemind,
      remindeOn: obj.remindeOn,
      startDate: obj.startDate,
      endDate: obj.endDate,
      isCompeleted: obj.isCompeleted,
      order: obj.order,
      categoryID: obj.categoryID,
    });
    res.message = task;
    res.statusCode = 200;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}

async function updateTask(id, obj) {
  try {
    const { error } = validateTask(obj);
    if (error) {
      res.statusCode = 400;
      res.message = error.details[0].message;
      return res;
    }
    const task = await Task.findByPk(id);
    task.task = obj.task;
    task.subTask = obj.subTask ? obj.subTask : null;
    task.categoryID = obj.categoryID;
    task.remindType = obj.remindType ? obj.remindType : null;
    task.remindeOn = obj.remindeOn ? obj.remindeOn : null;
    task.repeatRemind = obj.repeatRemind ? obj.repeatRemind : null;
    task.isCompeleted = obj.isCompeleted ? obj.isCompeleted : null;
    task.order = obj.order ? obj.order : null;
    task.startDate = obj.startDate ? obj.startDate : null;
    task.endDate = obj.endDate ? obj.endDate : null;

    const updatedTask = await task.save();
    res.statusCode = 200;
    res.message = updatedTask;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}

async function deleteTask(id) {
  try {
    await Task.destroy({ where: { id: id } });
    res.statusCode = 200;
    res.message = "Task removed!";
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}
module.exports = { Task, addNewTask, updateTask, deleteTask, getAllTasks };
