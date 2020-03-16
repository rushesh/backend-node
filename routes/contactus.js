const express = require('express');
const router = express.Router();
const contactusmodel = require('../models/contactus');

router.get('/allcontactuss',(req,res,next)=>{
    contactusmodel.getAllcontactuss((result,err)=>{
    if(err){
        res.status(400).statusText('Error');
    }
    else{
        res.status(200).json(result);
    }
    });
   
});

router.get('/allcontactussdate',(req,res,next)=>{
    contactusmodel.getAllcontactussDate((result,err)=>{
    if(err){
        res.status(400).statusText('Error');
    }
    else{
        res.status(200).json(result);
    }
    });
   
});

router.post('/getotp',(req,res,next)=>{
    
    let phonenumber = req.body.number;
    console.log(phonenumber);
    contactusmodel.sendotp(phonenumber,function(msg,err){
        if(err){
            console.log(err);
            res.status(400).statusText('Error');
        }
        else{
            res.status(200).json(msg);
        }
    });
});

router.post('/register',(req,res,next)=>{
    console.log('Register contactus ',req.body);
    let char;
    if(!req.body.otp){
        char = new contactusmodel({
            fname: req.body.fname,
            lname: req.body.lname,
            date: new Date(),
            number: req.body.number,
            otp:req.body.otp
      });    
    }
    else{
    char = new contactusmodel({
          fname: req.body.fname,
          lname: req.body.lname,
          date: new Date(),
          number: req.body.number,
    });
}
    console.log('contactus char ',char);

    contactusmodel.addcontactus(char,function(result){
        console.log('in result'+result);
        if(result == undefined || result == null){
            res.json({status:false,msg:'failed'});
        }
        else{
            res.json({status:true,msg:'successfull'});
        }
    });
});

module.exports = router;