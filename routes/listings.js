const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Show all listings
router.get("/listening", wrapAsync(async (req, res) => {
  const data = await Listing.find({});
  res.render("index", { data });
}));



// Show one listing
router.get("/showList/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id).populate("reviews");
  if(!data){
    req.flash('error', 'Listing has deleted');
    return res.redirect("/listening");
  }
  
  res.render("show", { data });
}));

// New listing form
router.get("/listening/new", (req, res) => {
  res.render("new");
});

// Create new listing
router.post("/listening", wrapAsync(async (req, res, next) => {
  try {
    if (!req.body.listing.image) {
      req.body.listing.image = {
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8",
        filename: "default.png",
      };
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'Listing is created');
    res.redirect("/listening");
  } catch (err) {
    next(err);
  }
}));

// Edit listing form
router.get("/listening/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  if(!data){
    req.flash('error', 'Listing has deleted');
    return res.redirect("/listening");
  }
  res.render("edit", { data });
}));

// Update listing
router.put("/showList/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body.listing;
  const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
  res.redirect(`/showList/${id}`);
}));

// Delete listing
router.delete("/showList/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listening");
}));

module.exports = router;
