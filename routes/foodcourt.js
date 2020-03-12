const express = require('express');
const router = express.Router();
const foodCourtModel = require('../models/foodcourts');

router.post('/addFoodCourt',(req,res,next)=>{
    let char = new foodCourtModel({
        foodcourtname:req.body.foodcourtname
    });
foodCourtModel.addFoodCourt(char,function(result){
        if(result == undefined || result == null){
            res.json({status:false,msg:'Failed',body:false});
        }
        else{
            res.json({status:true,msg:'Added',
            body:
            false
        });
        }
    });

});
router.get('/getall',(req,res,next)=>{
foodCourtModel.getAll(function(result){
    if(result == undefined || result == null){
        res.json({status:false,msg:'Fetch Failed',body:false});
    }
    else{

        res.json({status:true,msg:'Fetched',body:result});
    }
});
});
module.exports  = router;