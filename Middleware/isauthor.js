const Review = require("../models/review");

const isauthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
  
    let review_data = await Review.findById(reviewId);
  
    if (!review_data.author.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the author of this review");
      return res.redirect(`/showList/${id}`);
    }
  
    next();
  };

  module.exports=isauthor;
  