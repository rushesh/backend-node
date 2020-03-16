const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const accountSid = 'AC78544d6848ec42ddd756a5880ac77280';
const authToken = '8b68142eabb8ccfc53136eda19088e86';
const client = require('twilio')(accountSid, authToken);

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
    },
    otp:{
        type:Number
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

module.exports.sendotp = function(tophoneno,done){
let otp = getRandomIntInclusive(1000,9999);

  client.messages
  .create({
     body: 'Your OTP is : '+otp,
     from: '+14243528264',
     to: tophoneno
   }).then(function(message){
    done(message,null);
}).catch(err=>{
    done(null,err);
});
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }