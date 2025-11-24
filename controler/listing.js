const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let {category}=req.query;
  if(category){
    const data = await Listing.find({category:category});
    if(data.length===0){
      req.flash("error","No Listing Found");
      
      return res.redirect("/");

    }
    res.render("index", { data });
    return;

  }else{
    const data = await Listing.find({});
    res.render("index", { data });
    return;

  }
  
  
};

module.exports.showList = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
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

module.exports.createNew = (req, res) => {
  //console.log(req.user);
  res.render("new");
};

module.exports.postListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    if (!req.body.listing.image) {
      req.body.listing.image = {
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8",
        filename: "default.png",
      };
    }

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Listing is created");
    res.redirect("/listening");
  } catch (err) {
    next(err);
  }
};

module.exports.listingEditform = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);

  if (!data) {
    req.flash("error", "Listing has deleted");
    return res.redirect("/listening");
  }
  res.render("edit", { data });
};

module.exports.listingEditPostform = async (req, res) => {
  const { id } = req.params;

  const updateData = req.body.listing;

  const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
    

  }
  console.log("update listing ")
  req.flash("success","Listing is updated");
  res.redirect(`/showList/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing has deleted Successfully");
  res.redirect("/listening");
};
