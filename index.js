const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const Review= require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
app.use(express.json()); 
const ejsMate = require("ejs-mate");
const { nextTick } = require("process");
app.use(express.static(path.join(__dirname, "public")));
const {review_schema}=require("./schema.js");

const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // for parsing data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");


async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

app.get("/testList", async (req, res) => {
  let list = new Listing({
    title: "SmallHut",
    description: "It is a Hut",

    price: 3000,
    location: "Raya",
    country: "India",
  });
  await list.save();
  console.log(list);
  console.log("saved");
  res.send("Data Inserted");
});

app.get("/listening", async (req, res) => {
  const data = await Listing.find({});

  res.render("index", { data });
});

app.post("/listening", async (req, res) => {
  //let {title,description,image,price,location,country}=req.body;
  try{
    if (Listing.image == undefined || !req.body.Listing.image.url) {
        req.body.listing.image = {
          url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8",
          filename: "default.png",
        };
      }
      const newListing = await new Listing(req.body.listing);
      await newListing.save();
      console.log(newListing);
    
      res.redirect("/listening");

  }catch(err){
    next(err);
  }
 
});

app.get("/showList/:id", async (req, res) => {
  const { id } = req.params;
  let data = await Listing.findById(id).populate("reviews");

  res.render("show", { data });
});
app.get("/listening/new", (req, res) => {
  res.render("new");
});

app.get("/listening/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);

  res.render("edit", { data });
});

app.put("/showList/:id", async (req, res) => {
  const { id } = req.params;

  const UpdateData = req.body.listing;
  const UpdateListing = await Listing.findByIdAndUpdate(id, UpdateData, {
    new: true,
  });
  console.log(UpdateListing);
  res.redirect(`/showList/${id}`);
});

app.delete("/showList/:id", async (req, res) => {
  const { id } = req.params;
  const DeleteList = await Listing.findByIdAndDelete(id);
  console.log(DeleteList);
  res.redirect("/listening");
});
app.get("/", (req, res) => {
  res.send("Home ");
});





// validate reviews before sending to a database 
const validateReview = (req, res, next) => {
  const { error } = review_schema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
app.post("/showList/:id/review", validateReview,wrapAsync(async (req, res) => {
  try {
    let { id } = req.params;
    if (!req.body || !req.body.Review) {
      throw new ExpressError(400, "Review data is required");
    }
    let newReview = new Review(req.body.Review);
    console.log(newReview);

    let data = await Listing.findById(id);

    data.reviews.push(newReview);
    console.log("data", data);

    await newReview.save();
    await data.save();

    res.redirect(`/showList/${id}`);
  } catch (err) {
    console.error(" Error in review route:", err);
    res.status(500).send("Something went wrong");
  }
}));




// review delete route
app.delete("/showList/:id/review/:reviewId",(async(req,res)=>{
  let{id,reviewId}=req.params;
  let res1=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  

  let res2=await Review.findByIdAndDelete(reviewId);
  

  res.redirect(`/showList/${id}`);


}))


  


  







// middlewares
app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})
app.listen(port, () => {
  console.log("server is running");
});
