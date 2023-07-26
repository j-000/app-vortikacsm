const jwt = require('jsonwebtoken');
const SECRET_KEY = 'CHANGEME';


function AuthRequired(req, res, next) {
  // /API/ calls should always send the token in the Authorization header. Even if the cookie is set.
  
  // Use .originalUrl and not .url to compare full path.
  if(req.originalUrl.includes('/api/')){
    const authHeader = req.headers.authorization;

    // Check header is set and contains "Bearer".
    if (authHeader && authHeader.startsWith('Bearer ')) {

      // Check token is present
      if (authHeader.split(' ').length > 1) {

        const token = authHeader.split(' ')[1];

        if (token.split('.').length < 3) {
          res.json({error: 'Invalid token format.'});
          return
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
          if(err){
            res.json({error: 'Invalid token.'});
            return
          } else {
            // Set decoded user to request to use in view controller.
            // controllers will have access to user.token, user.orgid and user.permissions (set in contollers.authentication.js)
            req.user = decoded;
            next();
          }
        })
      } else {
        // Invalid token format
        res.status(401).json({ error: 'Invalid token format.' });
      }
    } else {
      // No cookie/auth header
      res.status(401).json({ error: 'No token provided.' });
    }
  } else {
    // Check token is set in cookie
    if (req.cookies.token) {
      jwt.verify(req.cookies.token, SECRET_KEY, (err, decoded) => {
        if(err){
          // Invalid token; Delete cookie and redirect to login.
          res.clearCookie('token');
          res.redirect('/login');
          return;
        } else {
          // Set decoded user to request to use in view controller.
          // controllers will have access to user.token, user.orgid and user.permissions (set in contollers.authentication.js)  
          req.user = decoded;

          // Allow access to route
          next();
        }
      })
    } else {
      // No token in cookie.
      res.redirect('/login')
    }
  }
}


module.exports = {
  AuthRequired,
  SECRET_KEY
}