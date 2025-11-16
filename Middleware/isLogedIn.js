// Middleware/isLogedIn.js
const isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      
      let redirectTo;
      if (req.method === "GET") {
        redirectTo = req.originalUrl; 
      } else {
        redirectTo = req.get("Referer") || req.originalUrl || "/listening";
      }
  
      req.session.redirectUrl = redirectTo;
      req.flash("error", "You must login first");
      return res.redirect("/login");
    }
    next();
  };
  
  module.exports = isLogedIn;
  