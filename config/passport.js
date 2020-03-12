var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const usermd = require('../models/user');

module.exports = function(passport){
var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('bearer');
opts.secretOrKey ='secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
// console.log("USing passport");
// console.log("Token:  "+opts.secretOrKey+" : "+opts.jwtFromRequest+" : "+opts.jwt_payload);
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log("jwt_payload is this : "+jwt_payload);
    usermd.findById(jwt_payload.data._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log("User : "+user);
            return done(false, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
};