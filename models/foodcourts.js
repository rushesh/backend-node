const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const foodCourtSchema = mongoose.Schema({
    foodcourtname:{ 
        type:String,
        required:true,
        unique:true
    }
});

const foodcourt = module.exports = mongoose.model('foodcourt',foodCourtSchema);

module.exports.addFoodCourt = function(foodcourtdata,done){

     return foodcourtdata.save().then(function(result){
         console.log("result value : "+result)
        if(result){         
            console.log('Saved');  
            done(result);
        }
        else{
            console.log('Not Saved');
            done(null);
        }
    }).catch((err)=>{
        console.log("not saved \n Error catch"+err);
        done(null);
    }); 
};

module.exports.getAll = function(done){
    foodcourt.find().then(function(result){
        console.log("getAll foodcourts Details " +result);
        done(result);  
      })
      .catch(err=>{
          console.log("getAll foodcourts Details catch err "+err);
          done(err);
      });
};