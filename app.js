const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const connect = require('./config/database');
const users = require('./routes/users');
const vendors = require('./routes/vendors');
const foodcourt = require('./routes/foodcourt');
const contactus = require('./routes/contactus');
const employees = require('./routes/employee');

app.use(bodyparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

app.use('/users',users);
app.use('/vendors',vendors);
app.use('/foodcourt',foodcourt);
app.use('/employees', employees);
app.use('/contactus', contactus);

app.get('*',(req,res)=>{
    res.send('Welcome');
});
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
const port = process.env.PORT||3000;

app.listen(port,'0.0.0.0', function () {
    console.log('Backend app listening',port);
  });