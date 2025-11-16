const mongoose = require("mongoose");
const Review = require("../models/review");
const Listing = require("../models/listing");
const initListingData = require("./data");

const { application } = require("express");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");
    console.log("Connected to MongoDB successfully");
    await initData();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  } finally {
    mongoose.connection.close();
  }
}

const initData = async () => {
  try {
    await Listing.deleteMany();
    


    const sampleListings = initListingData.data.map((obj) => ({
      ...obj,
      owner: "6916c7303540ada3b10bcff0",
    }));

    const inserted = await Listing.insertMany(sampleListings); // for making owner 

    console.log("Data is added:", inserted);
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

connectDB();

/*async function initData() {
  try {
    const inserted = await Review.create({
      comment: "Great place to stay!",
      rating: 5
    });
    console.log("✅ Data inserted:", inserted);
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  }
}*/
