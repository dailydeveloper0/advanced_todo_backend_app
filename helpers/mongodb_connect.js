const mongoose = require('mongoose');

function connect(){
    mongoose.connect("mongodb://127.0.0.1/todo")
        .then(()=>{
            console.log("DB connected");
        })
        .catch((reason)=>{
            console.log('DB coonection failed due to: ', reason);
        });
}

module.exports = connect;