const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const vendorSchema = mongoose.Schema({
    foodcourtname:{ 
        type:String,
        required:true
    },
    emailid:{
        type:String,
        required:true,
    },
    vendorname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    vendorcontactno:{
        type:Number
    }
});

const vendor = module.exports = mongoose.model('vendor',vendorSchema);

module.exports.addvendor = function(vendordata,done){

      const encryptedString = cryptr.encrypt(vendordata.password);
      vendordata.password = encryptedString;

     return vendordata.save().then(function(result){
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
module.exports.getvendorById = function(id,done){
    console.log("getvendorById vendor Details : " +id);
    vendor.findOne({_id:id}).then(function(result){
        console.log("getvendorById vendor Details : " +result);
        done(result);
      })
      .catch(err=>{
          console.log("getvendorById catch err "+ err);
          done(err);
      });;
};
module.exports.getvendorByEmail = function(email,done){
    // console.log("Email Id : "+email);
    vendor.findOne({emailid:email}).then(function(result){
        console.log("getvendorByEmail vendor Details " +result);
        done(result);  
      })
      .catch(err=>{
          console.log("getvendorByEmail catch err "+err);
          done(err);
      });
};
module.exports.getvendorByEmailFoodCourt = function(emailid,foodcourtname,done){
    vendor.findOne({emailid:emailid,foodcourtname:foodcourtname}).then(function(result){
        console.log("getvendorByEmailFoodCourt vendor Details " +result);
        done(result);  
      })
      .catch(err=>{
          console.log("getvendorByEmailFoodCourt catch err "+ err);
          done(err);
      });
};

module.exports.getvendorByUname = function(uname,done){
    vendor.findOne({vendorname:uname}).then(function(result){
      console.log("getvendorByUname vendor Details " +result);
      done(result);  
    })
    .catch(err=>{
        console.log("getvendorByUname catch err "+ err);
    });
};
module.exports.comparePassword = function(candidatePassword,hashedpwd,done){
    const decryptedString = cryptr.decrypt(hashedpwd);
    console.log("Old password :"+candidatePassword+" decrypted pwd "+decryptedString)

    if(decryptedString===candidatePassword){
        done(null, true);
    }
    else{
        done(null, false);
    }
};

module.exports.getvendorPassword = function(emailid,done){
    vendor.findOne({emailid:emailid}).then(function(result,err){
        // console.log("getvendorPassword vendor Details Password " + result.password);
        const decryptedString = cryptr.decrypt(result.password);
        done(decryptedString);  
      })
      .catch(err=>{
          console.log("getvendorPassword catch err " + err);
          done(null);
          throw(err);
      });
};


module.exports.changePassword = function(emailid,newpassword, done) {
     const encryptedString = cryptr.encrypt(newpassword);
     var myquery = { emailid: emailid };
     var newvalues = { $set: { password: encryptedString } };

     vendor.update(myquery,newvalues,function(err,doc){
        if (err) {
          console.log("update document error");
          done(err);
          throw err;
        } else {
          console.log("update document success");
          console.log(doc);
            done(true);
        }
     });
}; 