const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent route
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { review_schema } = require("../schema");
const isLogedIn = require('../Middleware/isLogedIn');
const isauthor=require('../Middleware/isauthor');
const ReviewController=require("../controler/review");



const validateReview = (req, res, next) => {
  const { error } = review_schema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};





router.post("/", validateReview,isLogedIn, wrapAsync(ReviewController.reviewpost));

router.delete("/:reviewId",isLogedIn,isauthor,wrapAsync(ReviewController.deleteReview));

module.exports = router;
