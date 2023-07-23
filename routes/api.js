const express = require('express');
const apiRoutes = express.Router()
const { FeedsController } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { CheckPermissions, PERMISSIONS } = require('../middlewares/permissions');
const { AuthenticationController } = require('../controllers/authentication');


/* /api/register */
apiRoutes.route('/register')
  .post(UsersController.register)


// // /api/login
apiRoutes.route('/login')
  .post(AuthenticationController.login);


// /api/logout
apiRoutes.route('/logout')
  .get(AuthenticationController.logout);


// /api/feeds
apiRoutes.route('/feeds')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWFEED), FeedsController.getAll)
  .post(AuthRequired, CheckPermissions(PERMISSIONS.CREATEFEED), FeedsController.create)


// /api/feeds/:feedid
apiRoutes.route('/feeds/:feedid')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWFEED), FeedsController.getById)
  .delete(AuthRequired, CheckPermissions(PERMISSIONS.DELETEFEED), FeedsController.delete)


// /api/users
apiRoutes.route('/users')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWUSER), UsersController.getAll)
  .post(AuthRequired, CheckPermissions(PERMISSIONS.CREATEUSER), UsersController.addNewUser)

// /api/users/:userid
apiRoutes.route('/users/:userid')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWUSER), UsersController.getById)
  .delete(AuthRequired, CheckPermissions(PERMISSIONS.DELETEUSER), UsersController.delete)
  
module.exports = {
  apiRoutes
}