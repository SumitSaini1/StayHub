// check logedin 
const isLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you have to must login first");
        return res.redirect("/login");
    }
    next();
}
module.exports=isLogedIn;

const saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
  


}
module.exports=saveRedirectUrl;
