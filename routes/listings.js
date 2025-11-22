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
const upload = multer({ storage });





//const isLogedIn = require('../Middleware/check_loged_in');
// Show all listings
router.get("/", (req, res) => {
  res.redirect("/listening");
});
router.get("/upload",(req,res)=>{
  res.render("cloudinary");
})
router.post("/upload",upload.single("image"),(req,res)=>{
  console.log("uploaded image URL:",req.file.path);
  res.json({
    success:true,
    url:req.file.path
  });
})






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
  "/listening",upload.single("listing[image]"),
  wrapAsync(listingControler.postListing)
);


/*router.post("/listening",upload.single("listing[image]"),wrapAsync(async(req,res)=>{
  console.log("uploaded image URL:",req.file.path);
  res.json({
    success:true,
    url:req.file.path
  });
}))*/



// Edit listing form
router.get(
  "/listening/:id/edit",
  isLogedIn,
  wrapAsync(listingControler.listingEditform)
);

// Update listing
router.put(
  "/showList/:id",
  isLogedIn,isowner,upload.single("listing[image]"),
  wrapAsync(listingControler.listingEditPostform)
);

// Delete listing
router.delete(
  "/showList/:id",
  isLogedIn,
  wrapAsync(listingControler.deleteListing)
);

module.exports = router;
