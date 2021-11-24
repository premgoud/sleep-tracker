const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");


passport.use(
  new LocalStrategy(
   
    {
      usernameField: "username",
      passwordField: "password"
    },
    (username, password, done) => {
      console.log("Passport middleware running!")
    
      db.User.findOne({username}).then(async dbUser => {
        console.log("passport",dbUser)
       
        const passwordCorrect = await dbUser.checkPW(password);
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
      
        else if (!passwordCorrect) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        
        return done(null, dbUser);
      });
    }
  )
);


passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


module.exports = passport;
