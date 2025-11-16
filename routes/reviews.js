const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent route
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { review_schema } = require("../schema");
const isLogedIn = require('../Middleware/isLogedIn');
const isauthor=require('../Middleware/isauthor');



const validateReview = (req, res, next) => {
  const { error } = review_schema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


router.post("/", validateReview,isLogedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!req.body.Review) throw new ExpressError(400, "Review data required");

  const newReview = new Review(req.body.Review);
  newReview.author=req.user._id;
  
  const listing = await Listing.findById(id);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  
  req.flash('success', 'Review is Created');

  res.redirect(`/showList/${id}`);
}));

router.delete("/:reviewId",isLogedIn,isauthor,wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('deleted', 'Review is Deleted');
  res.redirect(`/showList/${id}`);
}));

module.exports = router;
