const mongoose=require("mongoose");
const Review = require("../models/review");


const { application } = require("express");

async function connectDB() {
    try { 
      await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");
      console.log("Connected to MongoDB successfully");
      await initData();
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }finally{
        mongoose.connection.close();
    }
}





const initData=async()=>{
    await Listing.deleteMany();
    const inserted =await Listing.insertMany(sampleListings);
    console.log("data is added",inserted);
    
    
}






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