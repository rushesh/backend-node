const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const contactusSchema = mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    }
});

const contactus = module.exports = mongoose.model('contactus',contactusSchema);

module.exports.addcontactus = function(contactusdata,done){

     return contactusdata.save().then(function(result){
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
    // });
};


module.exports.getAllcontactuss = function(done){
    contactus.find().distinct.then(function(result){
        done(result);
    }).catch(err=>{
        done(err);
    });
}

module.exports.getAllcontactussDate = function(done){
    contactus.find().sort().then(function(result){
        done(result);
    }).catch(err=>{
        done(err);
    });
}
