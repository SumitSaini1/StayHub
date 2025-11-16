// Middleware/saveRedirectUrl.js
const saveRedirectUrl = (req, res, next) => {
    if (req.session && req.session.redirectUrl) {
      
      res.locals.redirectUrl = req.session.redirectUrl;
      delete req.session.redirectUrl;
    } else {
      
      res.locals.redirectUrl = "/listening";
    }
    next();
  };
  
  module.exports = saveRedirectUrl;
  