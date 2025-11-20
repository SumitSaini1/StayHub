const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.reviewpost=async (req, res) => {
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
  }

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('deleted', 'Review is Deleted');
    res.redirect(`/showList/${id}`);
  }