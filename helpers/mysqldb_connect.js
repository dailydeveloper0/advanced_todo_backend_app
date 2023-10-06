
const {Sequelize, DataTypes, Model} = require("sequelize");
const config = require("config");
const sequelize = new Sequelize(
    'todo',
    'admin',
    'mysql_admin',
    {
        host: 'localhost',
        dialect: 'mysql',
    },
    
);

async function connect(){
    sequelize.authenticate().then(()=>{
        console.log("Database connected successfully");
    }).catch((error)=>{
        console.log("Unable to connect to the database!");
    });
}

module.exports.connect = connect;
module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;
module.exports.Model = Model;
