const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

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
      req.flash("success", "User Registered Successful");
      res.redirect("/listening");
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
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let {username,password}=req.body;
    console.log("username",username);
    console.log("password",password);
    req.flash("success", "User login Successful");
    
    res.redirect("/listening");
  }
);

module.exports = router;
