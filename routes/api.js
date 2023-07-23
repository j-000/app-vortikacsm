const express = require('express');
const apiRoutes = express.Router()
const { FeedsController, AuthorizeOrIsOwner } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { RolesController } = require('../controllers/roles');
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



module.exports = {
  apiRoutes
}