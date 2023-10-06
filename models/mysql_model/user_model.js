const {
  sequelize,
  DataTypes,
  Model,
} = require("../../helpers/mysqldb_connect");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

var res = { statusCode: 0, message: "" };
const User = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role:{
    type: DataTypes.STRING,
    defaultValue:"user"
  }
});
async function encryptPass(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  } catch {
    return null;
  }
}
async function register(obj) {
  try {
    const encryptedPassword = await encryptPass(obj.password);
    if (!encryptedPassword) {
      return { statusCode: 500, message: "Unknown error occured here" };
    }
    obj.password = encryptedPassword;
    const result = await User.create(obj);
    res.statusCode = 200;
    res.message = result;
    return res;
  } catch (e) {
    return { statusCode: 500, message: "Unknown error occured" };
  }
}

async function update(obj, id) {
  try {
    var user = await User.findByPk(id);
    if (!user) return { statusCode: "401", message: "User not found" };
    user.firstName = obj.firstName;
    user.lastName = obj.lastName;
    user.email = obj.email;
    user = await user.save();
    res.statusCode = 200;
    res.message = user;
    return res;
  } catch (e) {
    res.statusCode = 500;
    res.message = "Unknown error occured";
    return res;
  }
}

async function getAllUsers() {
  try {
    res.message = await User.findAll();
    res.statusCode = 200;
    return res;
  } catch (e) {
    res.statusCode = 500;
    res.message = "Unknown error occured";
    return res;
  }
}

async function authenticateUser(obj) {
  try {
    const user = await User.findOne({ where: { email: obj.email } });
    // const encryptedPassword = await encryptPass(obj.password);
    const isPasswordValid = await bcrypt.compare(obj.password, user.password);
    if (!isPasswordValid) {
      res.statusCode = 400;
      res.message = "Invalid username or password!";
      return res;
    }
    const token = sign(user.id, user.role);
    if (!token) {
      res.statusCode = 500;
      res.message = "Unknown error occured 2";
      return res;
    }
    res.statusCode = 200;
    res.x_authToken = token;
    res.message = "Successfully logged in.";
    return res;
  } catch (e) {
    res.statusCode = 500;
    res.message = "Unknown error occured";
    return res;
  }
}

function sign(id, role) {
  try {
    const token = jwt.sign({ id:id, role:role },config.get("jwtPrivateKey"));
    return token;
  } catch (e) {
    return null;
  }
}

function verfiy(token) {
  try {
    const result = jwt.verify(token);
    return result;
  } catch (e) {
    return null;
  }
}
// Joi validation

const userJoiSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(50),
  lastName: Joi.string().required().min(3).max(50),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  role: Joi.string(),
  // password: Joi.string().required().min(6).max(20),
});

function validateNewUser(user) {
  const newUserJoiSchema = userJoiSchema.append({
    password: Joi.string().required().min(6).max(20),
  });

  return newUserJoiSchema.validate(user);
}
function validatePassword(password) {
  const passowrdJoiSchema = Joi.object({
    password: Joi.string().min(6).max(20).required(),
  });
  return passowrdJoiSchema.validate(password);
}
function validateUpdateUser(user) {
  return userJoiSchema.validate(user);
}

module.exports = {
  User,
  register,
  update,
  getAllUsers,
  validateNewUser,
  validatePassword,
  validateUpdateUser,
  authenticateUser,
};
