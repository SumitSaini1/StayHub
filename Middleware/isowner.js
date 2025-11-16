const Listing = require("../models/listing");

const isowner = async (req, res, next) => {
  const { id } = req.params;
  let list_data = await Listing.findById(id);
  if (!list_data.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of this post ");
    res.redirect(`/showList/${id}`);
  }
  next();
};



module.exports =  isowner;


