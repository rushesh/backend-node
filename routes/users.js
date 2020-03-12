// const express = require('express');
// const router = express.Router();
// const usermodel = require('../models/user');
// const passport = require('passport');
// var jwt = require('jsonwebtoken');
// const secret = 'mysecret';

// router.get('/profiledetails',(req,res,next)=>{
//     res.send('Details');
// });
// router.post('/register',(req,res,next)=>{
//     let char = new usermodel({
//         emailid:req.body.emailid,
//         firstname:req.body.firstname,
//         lastname:req.body.lastname,
//         title:req.body.title,
//         password:req.body.password,
//         username:req.body.username
//     });
//     usermodel.addUser(char,function(result){
//         console.log('in result'+result);
//         if(result == undefined || result == null){
//             res.json({status:false,msg:'Registration failed'});
//         }
//         else{
//             res.json({status:true,msg:'Registered successfully'});
//         }
//     });
// });
// router.post('/authenticate',(req,res,next)=>{
//     const  email = req.body.emailid;
//     const  password = req.body.password;
//     console.log("In router Authenticate : "+email +" - "+password);
//     usermodel.getUserByEmail(email,(user,err)=>{
//         if(err) {
//         console.log("Error In router Authenticate : "+err);throw err;}
//         // console.log("error : "+err+ " \nuser"+ this.user.emailid);
//         if(user==null){
//             console.log('User not found');
//             return res.json({status:false,statusText:'User not found'});
//         }
//         else{
//             usermodel.comparePassword(password, user.password,(err,isMatch)=>{
//                 console.log('comparePassword');
//                     if(err) {
//                     console.log("Error In router Authenticate Compare Pwd : "+err);
//                     return res.json({status:false,statusText:'DB Error'});
//                     throw err;
//                 }
//                     if(isMatch){
//                         console.log(' pwd matched '+user);
//                         const token = jwt.sign(user.toJSON(),secret,{
//                             expiresIn:60400
//                         });
//                         res.json({
//                             status:true,
//                             token: 'JWT'+token,
//                             user:{
//                                 id:user._id,
//                                 name:user.name,
//                                 username:user.username,
//                                 emailid:user.emailid
//                             },
//                             statusText:'User found'
//                         });
//                         console.log('setting token res sent'+user);
//                     }
//                     else{
//                         console.log('Wrong pwd');
//                         return res.json({status:false,statusText:'Wrong password'});
//                     }
//             });
//         }
//     });
// });
// module.exports = router;


//22jan

const express = require('express');
const router = express.Router();
const usermodel = require('../models/user');
const passport = require('passport');
var jwt = require('jsonwebtoken');
const secret = 'mysecret';
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


router.post("/changepassword", (req, res, next) => {
  const email = req.body.emailid;
  const newpwd = req.body.newpassword;
  console.log(email+" : "+newpwd);
  usermodel.changePassword(email, newpwd, (status, err) => {
    if (err) {
      console.log("Error In router Authenticate : " + err);
      return res.json({ status: false, statusText: "User not found" });
      throw err;
    }
    if(null){
        return res.json({
          status: false,
          statusText: "Failure"
        });
    }
    if (status) {
      return res.json({
        status: true,
        statusText: "Success"
      });
    }
  });
});


router.post('/getcurrentuserpassword',(req,res,next)=>{
    const email = req.body.emailid;
    usermodel.getUserPassword(email, (userpwd, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'User not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nuser"+ this.user.emailid);
        if (userpwd == null) {
          console.log("User not found");
          return res.json({ status: false, statusText: "User not found" });
        } else {
          return res.json({
            status: true,
            password: userpwd,
            statusText: userpwd
          });
        }
    });
});


router.post('/profiledetails',(req,res,next)=>{
    const email = req.body.emailid;
    // console.log("Email id : "+req);
    usermodel.getUserByEmail(email, (user, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'User not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nuser"+ this.user.emailid);
        if (user == null) {
            console.log('User not found');
            return res.json({ status: false, statusText: 'User not found' });
        }
        else{
            const decryptedpwd = cryptr.decrypt(user.password);
            return res.json({
                status:true,
                id:user._id,
                title:user.title,
                firstname:user.firstname,
                lastname:user.lastname,
                emailid:user.emailid,
                password:user.password,
                username: user.username
            });
        }
    });
});
router.post('/register',(req,res,next)=>{
    let char = new usermodel({
        emailid:req.body.emailid,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        title:req.body.title,
        password:req.body.password,
        username:req.body.username
    });
    usermodel.addUser(char,function(result){
        // console.log('in result'+result);
        if(result == undefined || result == null){
            res.json({status:false,msg:'Registration failed'});
        }
        else{
            res.json({status:true,msg:'Registered successfully'});
        }
    });
});
router.post('/authenticate',(req,res,next)=>{
    
    const  email = req.body.emailid;
    const  password = req.body.password;
    console.log("In router Authenticate : "+email +" - "+password);
    // return res.json({status:400});
    usermodel.getUserByEmail(email,(user,err)=>{
        if(err) {
        console.log("Error In router Authenticate : "+err);throw err;}
        console.log("error : "+err+ " \nuser"+ this.user.emailid);
        if(user==null){
            console.log('User not found');
            return res.json({status:false,statusText:'User not found'});
        }
        else{

            usermodel.comparePassword(password, user.password,(err,isMatch)=>{
                console.log('comparePassword');
                    if(err) {
                    console.log("Error In router Authenticate Compare Pwd : "+err);
                    return res.json({status:false,statusText:'DB Error'});
                    throw err;
                }
                    if(isMatch){
                        console.log(' pwd matched '+user);
                        const token = jwt.sign({data:user},secret,{
                            expiresIn:60480999*99999
                        });
                        res.json({
                            status:true,
                            token: 'bearer '+token,
                            user:{
                                id:user._id,
                                name:user.name,
                                username:user.username,
                                emailid:user.emailid
                            },
                            statusText:'User found'
                        });
                        console.log('setting token res sent'+user);
                    }
                    else{
                        console.log('Wrong pwd');
                        return res.json({status:false,statusText:'Wrong password'});
                    }
            });
        }
    });
});

router.get('/test', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        console.log("ji");
        res.send(req.user.profile);
    }
);
router.post('/getuserbyid',(req,res,next)=>{
    const id = req.body.id;
    usermodel.getUserById(id, (userpwd, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'User not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nuser"+ this.user.emailid);
        if (userpwd == null) {
          console.log("User not found");
          return res.json({ status: false, statusText: "User not found" });
        } else {
          return res.json({
            status: true,
            password: userpwd,
            statusText: userpwd
          });
        }
    });
});

module.exports = router;