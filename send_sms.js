const accountSid = 'AC78544d6848ec42ddd756a5880ac77280';
const authToken = '8b68142eabb8ccfc53136eda19088e86';
const client = require('twilio')(accountSid, authToken);

exports.module.sendotp =  client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+14243528264',
     to: '+919456889888'
   })
  .then(message => console.log(message));