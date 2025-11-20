const Listing = require("../models/listing");


module.exports.index=async (req, res) => {
    const data = await Listing.find({});
    res.render("index", { data });
  };

module.exports.showList=async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id)
      .populate({path:"reviews",populate:{
        path:"author",
      },
    })
      .populate("owner");
    if (!data) {
      req.flash("error", "Listing has deleted");
      return res.redirect("/listening");
    }
    //console.log(data);
    res.render("show", { data });
  };

module.exports.createNew=(req, res) => {
    //console.log(req.user);
    res.render("new");
  }

module.exports.postListing=async (req, res, next) => {
    try {
      if (!req.body.listing.image) {
        req.body.listing.image = {
          url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8",
          filename: "default.png",
        };
      }

      const newListing = new Listing(req.body.listing);

      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", "Listing is created");
      res.redirect("/listening");
    } catch (err) {
      next(err);
    }
  }
  


module.exports.listingEditform=async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id);
   


    if (!data) {
      req.flash("error", "Listing has deleted");
      return res.redirect("/listening");
    }
    res.render("edit", { data });
  }

module.exports.listingEditPostform=async (req, res) => {
  const { id } = req.params;
  

  const updateData = req.body.listing;
  
  const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  res.redirect(`/showList/${id}`);

}

module.exports.deleteListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing has deleted Successfully");
  res.redirect("/listening");
}