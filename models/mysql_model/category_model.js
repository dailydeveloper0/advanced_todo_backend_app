const {
  sequelize,
  DataTypes,
  Model,
} = require("../../helpers/mysqldb_connect");
const Joi = require("joi");

var res = { statusCode: 0, message: "" };
const Category = sequelize.define("categories", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  charset: "utf8mb4",
  collate:"utf8mb4_0900_as_cs",
});

const categoryJoiSchema = Joi.object({
  name: Joi.string().required(),
  userID: Joi.string().uuid().required(),
});

function validateCategory(category) {
  return categoryJoiSchema.validate(category);
}
async function getAllCategories(user) {
  try {
    const categories = await Category.findAll({
      where: {
        userID: user.id,
      },
    });
    res.statusCode = 200;
    res.message = categories;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}
async function addNewCategory(obj, user) {
  var newCategory = obj;
  newCategory.userID = user.id;
  console.log(newCategory);
  try {
    const { error } = validateCategory(newCategory);
    if (error) {
      res.statusCode = 400;
      res.message = error.details[0].message;
      return res;
    }
    const isDuplicated = await Category.findOne({
      where: { userID: user.id, name: obj.name },
      attributes: ["id"],
    });
    if (isDuplicated) {
      res.statusCode = 400;
      res.message = "Group already exists!";
      return res;
    }
    const category = await Category.create(newCategory);
    res.statusCode = 200;
    res.message = category;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}

async function updateCategory(id, obj) {
  try {
    const { error } = validateCategory(obj);
    if (error) {
      res.statusCode = 400;
      res.message = error.details[0].message;
      return res;
    }

    const category = await Category.findByPk(id);
    category.name = obj.name;
    await category.save();
    res.statusCode = 200;
    res.message = category;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}

async function deleteCategory(id) {
  try {
    const result = await Category.destroy({ where: { id: id } });
    res.statusCode = 200;
    res.message = "Category removed";
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}
module.exports = {
  Category,
  addNewCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
};
