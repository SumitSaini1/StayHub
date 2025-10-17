const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs = require("ejs"); ;
const  Listing = require("./models/listing");
const path=require("path");
const methodOverride = require('method-override');

const ejsMate=require("ejs-mate");
app.use(express.static(path.join(__dirname,"public")));

const port=3000;


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true})); // for parsing data 
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate); 


async function connectDB() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");
      console.log("Connected to MongoDB successfully");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
}
connectDB();

app.get("/testList",async(req,res)=>{
    let list=new Listing({
        title:"SmallHut",
        description:"It is a Hut",
        
        price:3000,
        location:"Raya",
        country:"India"
    
    });
    await list.save();
    console.log(list);
    console.log("saved");
    res.send("Data Inserted");


});


app.get("/listening",async(req,res)=>{
    const data=await Listing.find({});
   
    
    
    res.render("index",{data});

});

    app.post("/listening",async(req,res)=>{
        //let {title,description,image,price,location,country}=req.body;
        const newListing=await new Listing(req.body.listing);
        newListing.save()
        console.log(newListing);
        
        res.redirect("/listening")

    }) 

app.get("/showList/:id",async (req,res)=>{
    const {id}=req.params;
    let data= await Listing.findById(id);
    
    res.render("show",{data});
})
app.get("/listening/new",(req,res)=>{
    res.render("new");
})

app.get("/listening/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    
    res.render("edit",{data});

});


app.put("/showList/:id",async(req,res)=>{
    const {id}=req.params;
    
    const UpdateData=req.body.listing;
    const UpdateListing=await Listing.findByIdAndUpdate(id,UpdateData,{new:true});
    console.log(UpdateListing);
    res.redirect(`/showList/${id}`);
    
})

app.delete("/showList/:id",async(req,res)=>{
    const {id}=req.params;
    const DeleteList=await Listing.findByIdAndDelete(id);
    console.log(DeleteList);
    res.redirect("/listening");

})
app.get("/",(req,res)=>{
    res.send("Home ");
})





app.listen(port,()=>{
    console.log("server is running");
});

