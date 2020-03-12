const express = require('express');
const router = express.Router();
const vendormodel = require('../models/vendor');
const passport = require('passport');
var jwt = require('jsonwebtoken');
const secret = 'mysecret';
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


router.post("/changepassword", (req, res, next) => {
  const email = req.body.emailid;
  const newpwd = req.body.newpassword;
  console.log(email+" : "+newpwd);
  vendormodel.changePassword(email, newpwd, (status, err) => {
    if (err) {
      console.log("Error In router Authenticate : " + err);
      return res.json({ status: false, statusText: "vendor not found" });
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


router.post('/getcurrentvendorpassword',(req,res,next)=>{
    const email = req.body.emailid;
    vendormodel.getvendorPassword(email, (vendorpwd, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'vendor not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nvendor"+ this.vendor.emailid);
        if (vendorpwd == null) {
          console.log("vendor not found");
          return res.json({ status: false, statusText: "vendor not found" });
        } else {
          return res.json({
            status: true,
            password: vendorpwd,
            statusText: vendorpwd
          });
        }
    });
});


router.post('/profiledetails',(req,res,next)=>{
    const email = req.body.emailid;
    // console.log("Email id : "+req);
    vendormodel.getvendorByEmail(email, (vendor, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'vendor not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nvendor"+ this.vendor.emailid);
        if (vendor == null) {
            console.log('vendor not found');
            return res.json({ status: false, statusText: 'vendor not found' });
        }
        else{
            const decryptedpwd = cryptr.decrypt(vendor.password);
            return res.json({
                status:true,
                vendorcontactno:vendor.vendorcontactno,
                vendorname:vendor.vendorname,
                emailid:vendor.emailid,
                password:vendor.password
            });
        }
    });
});
router.post('/register',(req,res,next)=>{
    let char = new vendormodel({
        emailid:req.body.emailid,
        vendorname:req.body.vendorname,
        foodcourtname:req.body.foodcourtname,
        password:req.body.password,
        vendorcontactno:req.body.vendorcontactno
    });
    console.log("Char - "+char);
    vendormodel.getvendorByEmailFoodCourt(char.emailid,char.foodcourtname,function(found){
        if(found==null){

    vendormodel.addvendor(char,function(result){
        // console.log('in result'+result);
        if(result == undefined || result == null){
            res.json({status:false,msg:'Registration failed',body:false});
        }
        else{
            res.json({status:true,msg:'Registered successfully',body:false});
        }
    });
}
else{

    res.json({status:false,msg:'Vendor already registered in this food court ',body:true});}          
});
});

router.post('/authenticate',(req,res,next)=>{
    const  email = req.body.emailid;
    const foodcourtname = req.body.foodcourtname;
    const  password = req.body.password;
    // console.log("In router Authenticate : "+email +" - "+password);
    vendormodel.getvendorByEmailFoodCourt(email,foodcourtname,(vendor,err)=>{
        console.log("/authenticate Vendor : "+vendor+" \n Error : "+err)
        if(err) {
        console.log("Error In router Authenticate : "+err);
        throw err;
    }
        console.log("error : "+err+ " \nvendor"+ vendor.emailid);
        if(vendor==null){
            console.log('vendor not found');
            return res.json({status:false,statusText:'vendor not found'});
        }
        else{
            vendormodel.comparePassword(password, vendor.password,(err,isMatch)=>{
                // console.log('comparePassword');
                    if(err) {
                    // console.log("Error In router Authenticate Compare Pwd : "+err);
                    return res.json({status:false,statusText:'DB Error'});
                    throw err;
                }
                    if(isMatch){
                        // console.log(' pwd matched '+vendor);
                        const token = jwt.sign({data:vendor},secret,{
                            expiresIn:60480999*99999
                        });
                        res.json({
                            status:true,
                            token: 'bearer '+token,
                            vendor:{
                                id:vendor._id,
                                vendorcontactno:vendor.vendorcontactno,
                                vendorname:vendor.vendorname,
                                emailid:vendor.emailid
                            },
                            statusText:'vendor found'
                        });
                        // console.log('setting token res sent'+vendor);
                    }
                    else{
                        // console.log('Wrong pwd');
                        return res.json({status:false,statusText:'Wrong password'});
                    }
            });
        }
    });
});


router.post('/getvendorbyid',(req,res,next)=>{
    const id = req.body.id;
    vendormodel.getvendorById(id, (vendorpwd, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'vendor not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nvendor"+ this.vendor.emailid);
        if (vendorpwd == null) {
          console.log("vendor not found");
          return res.json({ status: false, statusText: "vendor not found" });
        } else {
          return res.json({
            status: true,
            password: vendorpwd,
            statusText: vendorpwd
          });
        }
    });
});

module.exports = router;