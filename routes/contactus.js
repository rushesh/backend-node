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

router.get('/getotp:/number',(req,res,next)=>{
    let phonenumber = req.params.number;
    contactusmodel.sendotp((phonenumber,msg,err)=>{
        if(err){
            res.status(400).statusText('Error');
        }
        else{
            res.status(200).json(msg);
        }
    });
});

router.post('/register',(req,res,next)=>{
    console.log('Register contactus ',req.body);

    if(!req.body.otp){
        let char = new contactusmodel({
            fname: req.body.department,
            lname: req.body.doj,
            date: new Date(),
            number: req.body.email,
            otp:req.body.otp
      });    
    }
    else{
    let char = new contactusmodel({
          fname: req.body.department,
          lname: req.body.doj,
          date: new Date(),
          number: req.body.email,
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