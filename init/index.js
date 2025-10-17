const mongoose=require("mongoose");
const Listing = require("../models/listing");
const  sampleListings = require("./data");
const { application } = require("express");

async function connectDB() {
    try { 
      await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");
      console.log("Connected to MongoDB successfully");
      await iniData();
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }finally{
        mongoose.connection.close();
    }
}

const iniData=async()=>{
    await Listing.deleteMany();
    const inserted =await Listing.insertMany(sampleListings);
    console.log("data is added",inserted);
    
    
}




connectDB(); 