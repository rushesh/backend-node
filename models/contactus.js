const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


const accountSid = 'AC78544d6848ec42ddd756a5880ac77280';
const authToken = 'acd9e1da2e542b1c1f981f9e4c937116';
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
        type:String,
        required:true,
    },
    otp:{
        type:String
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
};

module.exports.getAllcontactuss = function(done){
    contactus.aggregate([
        // Group the docs by the geo field, taking the first doc for each unique geo
        {
            $group: {
            _id: '$number',
            doc: { $first: '$$ROOT' }
        }}
    ],(error,ids)=>{
        if(error){
            done(error)
        }
        else{
            done(ids)
        }
    });
}

module.exports.getAllcontactussDate = function(done){
    contactus.find({otp:{$ne:null}}).sort({date:-1}).then(function(result){
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
       console.log(message);
    done(message,null);
}).catch(err=>{
    console.log(err);
    done(null,err);
});
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }