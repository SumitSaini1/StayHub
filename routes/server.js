
const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const flash = require('connect-flash');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const listingsRouter = require("./listings");
const reviewsRouter = require("./reviews");




console.log("listingsRouter typeof:", typeof listingsRouter);
console.log("reviewsRouter typeof:", typeof reviewsRouter);


const sessionoption={
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
  }

app.use(session(sessionoption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.messages=req.flash("success");
    res.locals.errmessages=req.flash("error");
    next();
    


})

app.get("/register",(req,res)=>{
    let{name="anonymus"}=req.query;
    req.session.name=name;
    if(name==="anonymus"){
        req.flash('error', 'user is not registered');
    }else{
        req.flash('success', 'user is registered');
    }
    
    
    res.redirect("/hello")
});
app.get("/hello",(req,res)=>{
   

    res.render("flash",{name:req.session.name}); // 2nd method  
    //res.render("flash",{name:req.session.name,msg:req.flash("success")}); // ist method 

    

});
/*app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
   
    res.send(`you sent a request ${req.session.count} times`);

})*/

app.use("/listings", listingsRouter); // listings routes: GET / -> /listings/
app.use("/listings/:id/reviews", reviewsRouter); // reviewsRouter will see req.params.id because of mergeParams




app.get("/test", (req, res) => res.send("Test successful"));

app.listen(3000, () => console.log("Server running on port 3000"));
 