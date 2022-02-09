
const { Router } = require("express");
const router = Router();
const passport = require("passport");
const USERSCHEMA = require("../Model/Auth")
const bcrypt = require("bcryptjs");


/*HTTP Get request
@access public
@url/auth/register*/
router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});
router.get("/login", (req, res) => {
  res.render("../views/auth/login", {});
});
/*HTTP Get request
@access public
@url/auth/register*/
router.post("/register", async(req, res) => {
  let { username, email, password, password1 } = req.body;
  let errors = [];
  if (!username) {
    errors.push({ text: "username is required" });
  }
  if (username.length < 6) {
    errors.push({ text: "username min 6 character" });
  }
  if (!email) {
    errors.push({ text: "email is required" });
  }
  if (!password) {
    errors.push({ text: "password is required" });
  }
  if (password !== password1) {
    errors.push({ text: "password is not matched" });
  }
  if (errors.length > 0) {
    res.render("../views/auth/register", {
      errors,
      username,
      email,
      password,
      password1
    });
    
  } else {
      let user = await USERSCHEMA.findOne({ email });
    if (user) {
      req.flash(
        "ERROR_MESSAGE",
        "Email already exist please add new mail")
      res.redirect("/auth/register", 302, {});
    }
    else {
      let newUser = new USERSCHEMA({
        username,
        email,
        password,
      });
      bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err;
        console.log(salt);
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          console.log(hash);
          newUser.password = hash;
          await newUser.save();
          req.flash("SUCCESS_MESSAGE", "successfully registered");
          res.redirect("/auth/login", 302, {})
        });
      });
   
    }
   
  }

});



router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/employee/home",
    failureRedirect: "/auth/login",
    failureFlash: true,
    
  })(req, res, next);
})


  module.exports = router;