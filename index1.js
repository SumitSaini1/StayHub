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

// for sessions and connect flash 
const session = require("express-session");
const flash=require("connect-flash");

// for authentication user 
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");





const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // for parsing data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

// Routes
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user.js");



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




const sessionoption={
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
     expires:Date.now()+7*24*60*60*1000,
     maxAge: 7*24*60*60*1000,
     httpOnly: true,
  },
}; 

app.use(session(sessionoption));
app.use(flash());

// for passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.messages=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.deleted=req.flash("deleted");
  res.locals.currUser=req.user;
  
  next();
  


})
app.get("/demouser",async(req,res)=>{
  try{
    let newfake=new User({
      email:"ss@123",
      username:"saini-ji"
    })
    let registerUser=await User.register(newfake,"hello");
    console.log(registerUser);
    res.send("register successfullt");
  }catch(err){
    console.log(err);
    res.send("Error registering user");
  }
});


app.use("/", listingsRouter);
app.use("/showList/:id/review", reviewsRouter);
app.use("/", userRouter);
  

app.get('/favicon.ico', (req, res) => res.status(204).end());

// middlewares
/*app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})*/
app.listen(port, () => {
  console.log("server is running");
});