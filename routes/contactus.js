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



router.post('/register',(req,res,next)=>{
    console.log('Register contactus ',req.body);

    let char = new contactusmodel({
          department: req.body.department,
          doj: req.body.doj,
          name: req.body.name,
          email: req.body.email,
          contactusid: req.body.contactusid,
        //   password: req.body.password
    });
    console.log('contactus char ',char);

    contactusmodel.addcontactus(char,function(result){
        console.log('in result'+result);
        if(result == undefined || result == null){
            res.json({status:false,msg:'Registration failed'});
        }
        else{
            res.json({status:true,msg:'Registered successfully'});
        }
    });
});

module.exports = router;