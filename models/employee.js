const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert  = require('assert');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const employeeSchema = mongoose.Schema({
    department:{ 
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    doj:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    employeeid:{
        type:String,
        required:true,
        unique:true
    }
    // ,
    // password:{
    //     type:String,
    //     required:true
    // }
});

const employee = module.exports = mongoose.model('employee',employeeSchema);

module.exports.addemployee = function(employeedata,done){

    //   const encryptedString = cryptr.encrypt(employeedata.password);
    //   employeedata.password = encryptedString;

     return employeedata.save().then(function(result){
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


module.exports.getAllEmployees = function(done){
    employee.find().then(function(result){
        done(result);
    }).catch(err=>{
        done(err);
    });
}

module.exports.deleteSelectedEmployee = function(empid,done){
    console.log('deletion id',empid);
    employee.deleteOne({_id:empid}, (err, todo) => {
        // As always, handle any potential errors:
        if (err) done(err);
        done(todo);
})
}

module.exports.getemployeeById = function(id,done){
    console.log("getemployeeById employee Details : " +id);
    employee.findOne({_id:id}).then(function(result){
        console.log("getemployeeById employee Details : " +result);
        done(result);
      })
      .catch(err=>{
          console.log("getemployeeById catch err "+ err);
          done(err);
      });;
};
module.exports.getemployeeByEmail = function(emailid,done){
    employee.findOne({emailid:emailid}).then(function(result){
        console.log("getemployeeByEmail employee Details " +result);
        done(result);  
      })
      .catch(err=>{
          console.log("getemployeeByEmail catch err "+ err);
          done(err);
      });
};
module.exports.getemployeeByUname = function(uname,done){
    employee.findOne({employeename:uname}).then(function(result){
      console.log("getemployeeByUname employee Details " +result);
      done(result);  
    })
    .catch(err=>{
        console.log("getemployeeByUname catch err "+ err);
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

module.exports.getemployeePassword = function(emailid,done){
    employee.findOne({emailid:emailid}).then(function(result,err){
        // console.log("getemployeePassword employee Details Password " + result.password);
        const decryptedString = cryptr.decrypt(result.password);
        done(decryptedString);  
      })
      .catch(err=>{
          console.log("getemployeePassword catch err " + err);
          done(null);
          throw(err);
      });
};


module.exports.changePassword = function(emailid,newpassword, done) {
     const encryptedString = cryptr.encrypt(newpassword);
     var myquery = { emailid: emailid };
     var newvalues = { $set: { password: encryptedString } };

     employee.update(myquery,newvalues,function(err,doc){
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