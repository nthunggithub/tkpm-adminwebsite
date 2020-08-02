const isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash('error', 'Sorry, but you are already logged in!');
      res.redirect('/');
    } else {
      return next();
    }
  };
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      
      res.redirect('/login');
    }
  };

module.exports = {isNotAuthenticated: isNotAuthenticated, isAuthenticated: isAuthenticated}

  