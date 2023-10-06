const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  name: {
    type: String,
    required:true,
  },
  createdAt:{
    type:Date,
    default: Date.now,
  }
});
const categorySchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  categories:{
    type:[categoriesSchema]
  }
  
});

const Category = mongoose.model("Category", categorySchema);

const categoryJoiSchema = Joi.object({
  name: Joi.string().required(),
});

function validateCategory(category) {
  return categoryJoiSchema.validate(category);
}

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;
