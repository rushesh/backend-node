// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const assert  = require('assert');

// const UserSchema = mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     firstname:{
//         type:String,
//         required:true
//     },
//     lastname:{
//         type:String,
//         required:true
//     },
//     emailid:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     username:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// });

// const User = module.exports = mongoose.model('User',UserSchema);

// module.exports.addUser = function(userdata,done){
//     bcrypt.hash(userdata.password, 10, function(err, hash) {
//     console.log('pwd eccrypted'+userdata);
//       userdata.password = hash;
//      return userdata.save().then(function(result){
//          console.log("result value : "+result)
//         if(result){         
//             console.log('Saved');  
//             done(result);
//         }
//         else{
//             console.log('Not Saved');
//             done(null);
//         }
//     }).catch((err)=>{
//         console.log("not saved \n Error catch"+err);
//         done(null);
//     });  
//     });
// };
// module.exports.getUserById = function(id){
//     User.findById({_id:id});
// };
// module.exports.getUserByEmail = function(emailid,done){
//     User.findOne({emailid:emailid}).then(function(result){
//         console.log("getUserByEmail User Details " +result);
//         done(result);  
//       })
//       .catch(err=>{
//           console.log("getUserByEmail catch err "+ err);
//           done(err);
//       });
// };
// module.exports.getUserByUname = function(uname,done){
//     User.findOne({username:uname}).then(function(result){
//       console.log("getUserByUname User Details " +result);
//       done(result);  
//     })
//     .catch(err=>{
//         console.log("getUserByUname catch err "+ err);
//     });
// };
// module.exports.comparePassword = function(candidatePassword,hash,done){
//     bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
//         if(err) {
//             throw err;
//             done(err);
//         }
//         else
//         done(null,isMatch);
//     })
// };


//22 Jan modified

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const UserSchema = mongoose.Schema({
    title:{ 
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    emailid:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

module.exports.addUser = function(userdata,done){

      const encryptedString = cryptr.encrypt(userdata.password);
      userdata.password = encryptedString;

     return userdata.save().then(function(result){
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
module.exports.getUserById = function(id,done){
    console.log("getUserById User Details : " +id);
    User.findOne({_id:id}).then(function(result){
        console.log("getUserById User Details : " +result);
        done(result);
      })
      .catch(err=>{
          console.log("getUserById catch err "+ err);
          done(err);
      });;
};
module.exports.getUserByEmail = function(emailid,done){
    User.findOne({emailid:emailid}).then(function(result){
        console.log("getUserByEmail User Details " +result);
        done(result);  
      })
      .catch(err=>{
          console.log("getUserByEmail catch err "+ err);
          done(err);
      });
};
module.exports.getUserByUname = function(uname,done){
    User.findOne({username:uname}).then(function(result){
      console.log("getUserByUname User Details " +result);
      done(result);  
    })
    .catch(err=>{
        console.log("getUserByUname catch err "+ err);
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

module.exports.getUserPassword = function(emailid,done){
    User.findOne({emailid:emailid}).then(function(result,err){
        // console.log("getUserPassword User Details Password " + result.password);
        const decryptedString = cryptr.decrypt(result.password);
        done(decryptedString);  
      })
      .catch(err=>{
          console.log("getUserPassword catch err " + err);
          done(null);
          throw(err);
      });
};


module.exports.changePassword = function(emailid,newpassword, done) {
     const encryptedString = cryptr.encrypt(newpassword);
     var myquery = { emailid: emailid };
     var newvalues = { $set: { password: encryptedString } };

     User.update(myquery,newvalues,function(err,doc){
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