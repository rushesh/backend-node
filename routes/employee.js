const express = require('express');
const router = express.Router();
const employeemodel = require('../models/employee');
const passport = require('passport');
var jwt = require('jsonwebtoken');
const secret = 'mysecret';
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


router.post("/changepassword", (req, res, next) => {
  const email = req.body.emailid;
  const newpwd = req.body.newpassword;
  console.log(email+" : "+newpwd);
  employeemodel.changePassword(email, newpwd, (status, err) => {
    if (err) {
      console.log("Error In router Authenticate : " + err);
      return res.json({ status: false, statusText: "employee not found" });
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

router.get('/allemployees',(req,res,next)=>{
    
    employeemodel.getAllEmployees((result,err)=>{
        
    if(err){
        res.status(400).statusText('Error');
    }
    else{
        res.status(200).json(result);
    }
    });
   
});

router.delete('/deleteEmployee/:id',(req,res,next)=>{
    
    employeemodel.deleteSelectedEmployee(req.params.id,(doc,err)=>{
        console.log(err,doc);
        if(err){
            return res.json({status : 400,statusText : 'failure'});
        }
        else if(doc.deletedCount>0){
            return res.json({status : 200,statusText : 'success'});
        }
        else{
            return res.json({status : 404,statusText : 'failure'});
        }
    });

});

router.post('/getcurrentemployeepassword',(req,res,next)=>{
    const email = req.body.emailid;
    employeemodel.getemployeePassword(email, (employeepwd, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'employee not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nemployee"+ this.employee.emailid);
        if (employeepwd == null) {
          console.log("employee not found");
          return res.json({ status: false, statusText: "employee not found" });
        } else {
          return res.json({
            status: true,
            password: employeepwd,
            statusText: employeepwd
          });
        }
    });
});


router.post('/profiledetails',(req,res,next)=>{
    const email = req.body.emailid;
    // console.log("Email id : "+req);
    employeemodel.getemployeeByEmail(email, (employee, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'employee not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nemployee"+ this.employee.emailid);
        if (employee == null) {
            console.log('employee not found');
            return res.json({ status: false, statusText: 'employee not found' });
        }
        else{
            const decryptedpwd = cryptr.decrypt(employee.password);
            return res.json({
                status:true,
                id:employee._id,
                title:employee.title,
                firstname:employee.firstname,
                lastname:employee.lastname,
                emailid:employee.emailid,
                password:employee.password,
                employeename: employee.employeename
            });
        }
    });
});

router.post('/register',(req,res,next)=>{
    console.log('Register Employee ',req.body);

    let char = new employeemodel({
          department: req.body.department,
          doj: req.body.doj,
          name: req.body.name,
          email: req.body.email,
          employeeid: req.body.employeeid,
        //   password: req.body.password
    });
    console.log('Employee char ',char);

    employeemodel.addemployee(char,function(result){
        console.log('in result'+result);
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
    employeemodel.getemployeeByEmail(email,(employee,err)=>{
        if(err) {
        console.log("Error In router Authenticate : "+err);throw err;}
        console.log("error : "+err+ " \nemployee"+ this.employee.emailid);
        if(employee==null){
            console.log('employee not found');
            return res.json({status:false,statusText:'employee not found'});
        }
        else{

            employeemodel.comparePassword(password, employee.password,(err,isMatch)=>{
                console.log('comparePassword');
                    if(err) {
                    console.log("Error In router Authenticate Compare Pwd : "+err);
                    return res.json({status:false,statusText:'DB Error'});
                    throw err;
                }
                    if(isMatch){
                        console.log(' pwd matched '+employee);
                        const token = jwt.sign({data:employee},secret,{
                            expiresIn:60480999*99999
                        });
                        res.json({
                            status:true,
                            token: 'bearer '+token,
                            employee:{
                                id:employee._id,
                                name:employee.name,
                                employeename:employee.employeename,
                                emailid:employee.emailid
                            },
                            statusText:'employee found'
                        });
                        console.log('setting token res sent'+employee);
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
        res.send(req.employee.profile);
    }
);
router.post('/getemployeebyid',(req,res,next)=>{
    const id = req.body.id;
    employeemodel.getemployeeById(id, (employeepwd, err) => {
        if (err) {
            console.log("Error In router Authenticate : " + err); 
            return res.json({ status: false, statusText: 'employee not found' });
            throw err;
        }
        // console.log("error : "+err+ " \nemployee"+ this.employee.emailid);
        if (employeepwd == null) {
          console.log("employee not found");
          return res.json({ status: false, statusText: "employee not found" });
        } else {
          return res.json({
            status: true,
            password: employeepwd,
            statusText: employeepwd
          });
        }
    });
});

module.exports = router;