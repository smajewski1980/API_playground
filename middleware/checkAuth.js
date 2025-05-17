const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/product");
  // since if not admin throws the overlay(specific page elements...) not sure how to implement this
};

module.exports = checkAuth;
