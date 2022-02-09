//need 3 modules

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//load auth schema

const USERSCHEMA = require("../Model/Auth");
const passport = require("passport");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        //check emaiil exsist or not
        let user = await USERSCHEMA.findOne({ email });

        //checking user exist or not
        if (!user) {
          done(null, false, { message: "user not exist" }); // false not storing user, not passing any object
          // 3rd para,eter is consider as message
        }
        //match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return done(null, false, { message: "passport doent match" });
          } else {
            return done(null, user);
          }
        });
      }
    )
  );

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    USERSCHEMA.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
