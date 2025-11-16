const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
//const saveRedirectUrl = require('../Middleware/saveRedirectUrl');
const isLogedIn = require('../Middleware/isLogedIn');
const saveRedirectUrl = require("../Middleware/saveRedirectUrl");



router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser,(err)=>{
        if(err){
          return next(err);

        }
        req.flash("success", "Welcome to StayHub");
        res.redirect("/listening");
      })
      
    } catch (err) {
      console.error(err);

      req.flash(
        "error",
        err.message || "Something went wrong. Please try again."
      );

      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});
router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let {username,password}=req.body;
    
    req.flash("success", "Welcome to StayHub");
    
    res.redirect(res.locals.redirectUrl || "/listening");
  }
);


router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Logout Successful");
    res.redirect("listening");

  })
})
module.exports = router;
