const express = require("express");
const config = require("config");

const { connect, sequelize } = require("./helpers/mysqldb_connect");
const categories = require("./routes/categories");
const tasks = require("./routes/tasks");
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();

app.use(express.json());
app.use("/categories", categories);
app.use("/tasks", tasks);
app.use("/users", users);
app.use("/auth", auth);

const initApp = async () => {
 
  await connect();
  
  await sequelize.sync({alter: true});
  
  
 
  const PORT = config.get("port");
  if (PORT == null || PORT == "") {
    console.log("todoBakcendPort is not configured");
  } else {
    app.listen(PORT);
    console.log("Server Listening on port: ", PORT);
  }
};


initApp();