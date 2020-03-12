const mongoose = require('mongoose');
// const url = "mongodb+srv://admin-employee:admin-employee@cluster0-qjzui.mongodb.net/test?retryWrites=true&w=majority/test";
// const connect = mongoose.connect(url,
// {useNewUrlParser:true,useUnifiedTopology:true},function(err){
//     if(err) 
//     {
//     console.log(err);
//     }
//     else
//     {
//     console.log('****DB connection UP. DB connected successfully.****');
//     }
// });

const connect = mongoose.connect('mongodb+srv://admin-employee:adminemployee@cluster0-qjzui.mongodb.net/backend-fullstack1?retryWrites=true&w=majority', 
    {useNewUrlParser: true, useUnifiedTopology:true },(err)=>{
        if(err) {
            console.log('Some problem with the connection ' +err);
        } else {
            console.log('The Mongoose connection is ready');
        }
    }
    );

module.exports = connect;