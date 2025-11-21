const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const isLogedIn = require("../Middleware/isLogedIn");
const isowner = require("../Middleware/isowner");
const listingControler=require("../controler/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig");
//const upload = multer({ storage });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});



//const isLogedIn = require('../Middleware/check_loged_in');
// Show all listings
router.get("/", (req, res) => {
  res.redirect("/listening");
});
router.get(
  "/listening",
  wrapAsync(listingControler.index)
);

// Show one listing
router.get(
  "/showList/:id",
  wrapAsync(listingControler.showList)
);

// New listing form
router.get("/listening/new", isLogedIn,listingControler.createNew );

// Create new listing
router.post(
  "/listening",
  wrapAsync(listingControler.postListing)
);



// Edit listing form
router.get(
  "/listening/:id/edit",
  isLogedIn,
  wrapAsync(listingControler.listingEditform)
);

// Update listing
router.put(
  "/showList/:id",
  isLogedIn,isowner,
  wrapAsync(listingControler.listingEditPostform)
);

// Delete listing
router.delete(
  "/showList/:id",
  isLogedIn,
  wrapAsync(listingControler.deleteListing)
);

module.exports = router;
