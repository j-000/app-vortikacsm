const express = require('express');
const apiRoutes = express.Router()
const { FeedsController } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { jwtrequired } = require('../middlewares/authentication');


/*

Users Collection

*/
apiRoutes.get('/users', jwtrequired, UsersController.getUsers);


/*

Register, Login and Logout

*/

apiRoutes.post('/register', UsersController.createUser);
apiRoutes.post('/login', UsersController.loginUser);
apiRoutes.get('/logout', UsersController.logoutUser);




// Get all feeds records
apiRoutes.get('/feeds/:userid', jwtrequired, FeedsController.getFeeds);

// Add one feed
// apiRoutes.post('/feeds') 

// Edit one feed
// apiRoutes.put('/feeds') 

// Delete one feed
// apiRoutes.delete('/feeds')




module.exports = {
  apiRoutes
}