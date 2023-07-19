const jwt = require('jsonwebtoken');


const SECRET_KEY = 'CHANGEME';


// This functions ensures API calls use JWT token
function jwtrequired(req, res, next) {
  // /API/ calls should always send the token in the Authorization header. Even if the cookie is set.
  // Use .originalUrl and not .url to compare full path.
  if(req.originalUrl.includes('/api/')){
    const authHeader = req.headers.authorization;
    // Check header is set and contains "Bearer".
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Check token is present
      if (authHeader.split(' ').length > 1) {
        const token = authHeader.split(' ')[1];
        // Validate token
        jwt.verify(req.cookies.token, SECRET_KEY, (err, decoded) => {
          if(err){
            res.json({error: 'Invalid token.'});
            return
          } else {
            // Set decoded user to request to use in view controller.
            req.user = decoded;
            next();
            return
          }
        })
      } else {
        // Invalid token format
        res.status(401).json({
          error: 'Invalid token format.'
        });
        return;
      }
    } else {
      // No cookie/auth header
      res.status(401).json({
        error: 'No token provided.'
      })
      return;
    }
  } else {
    // Check token is set in cookie
    if (req.cookies.token) {
      // Validate token
      jwt.verify(req.cookies.token, SECRET_KEY, (err, decoded) => {
        if(err){
          // Invalid token; Delete cookie and redirect to login.
          res.clearCookie('token');
          res.redirect('/login');
          return
        } else {
          // Token is valid; Allow user to access page.
          next();
          return
        }
      })
    } else {
      // No token; Delete cookie and redirect to login.
      res.redirect('/login')
      return
    }
  }
}

module.exports = {
  jwtrequired,
  SECRET_KEY
}