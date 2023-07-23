const express = require('express');
const apiRoutes = express.Router()
const { FeedsController, AuthorizeOrIsOwner } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { CheckPermissions, PERMISSIONS } = require('../middlewares/permissions');
const { AuthenticationController } = require('../controllers/authentication');


/* /api/register */
apiRoutes.route('/register')
  .post(UsersController.create)


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


module.exports = {
  apiRoutes
}