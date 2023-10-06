const { DataTypes } = require("sequelize");
const {User} = require("./user_model");
const {Task} = require("./task_model");
const {Category} = require("./category_model");

//Creating association between User and Category (One-To-Many)
User.hasMany(Category, {
  foreignKey: {
    name: "userID",
    allowNull: false,
    type: DataTypes.UUID,
  },
});
Category.belongsTo(User, {
  foreignKey: {
    name: "userID",
    allowNull: false,
    type: DataTypes.UUID,
  },
});

//Creating association between Category and Task (One-To-Many)
Category.hasMany(Task, {
  foreignKey: {
    name: "categoryID",
    allowNull: false,
    type: DataTypes.UUID,
  },
});

Task.belongsTo(Category,{
  foreignKey: {
    name: "categoryID",
    allowNull: false,
    type: DataTypes.UUID,
  },
});

module.exports.User = User;
module.exports.Task = Task;
module.exports.Category = Category;
