



require("dotenv").config();


const express = require("express");
const app = express();

const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
app.use(express.json());
const ejsMate = require("ejs-mate");
const { nextTick } = require("process");
app.use(express.static(path.join(__dirname, "public")));
const { review_schema } = require("./schema.js");

// for sessions and connect flash
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

// for authentication user
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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

const db_url = process.env.ATLAS_DB;
if (!db_url) {
  console.error("ATLAS_DB env var missing — set it in .env or env");
  process.exit(1);
}
console.log("Mongo DB URL:", db_url);

const atlas_store = MongoStore.create({
  mongoUrl: db_url,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

atlas_store.on("error", (err) => {
  console.error("error in atlas store:", err);
});

const sessionoption = {
  atlas_store,
 
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

async function connectDB() {
  try {
    await mongoose.connect(db_url);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

// Apply session first
app.use(session(sessionoption));
app.use(flash());

// Apply passport AFTER session
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.deleted = req.flash("deleted");
  res.locals.currUser = req.user;

  next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use("/", listingsRouter);
app.use("/showList/:id/review", reviewsRouter);
app.use("/", userRouter);

app.get("/favicon.ico", (req, res) => res.status(204).end());

// middlewares
/*app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})*/

app.listen(port, () => {
  console.log("server is running");
})
