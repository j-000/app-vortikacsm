const express = require('express');
const apiRoutes = express.Router()
const { FeedsController } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { CheckPermissions, PERMISSIONS } = require('../middlewares/permissions');
const { DashboardController } = require('../controllers/dashboard');
const { JobsController } = require('../controllers/jobs');
const { MappingController } = require('../controllers/mapping');


/* /api/register */
apiRoutes.route('/register')
  .post(UsersController.register)


// /api/login
apiRoutes.route('/login')
  .post(UsersController.login);


// /api/logout
apiRoutes.route('/logout')
  .get(UsersController.logout);


// /api/feeds
apiRoutes.route('/feeds')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEW_FEED), FeedsController.getAll)
  .post(AuthRequired, CheckPermissions(PERMISSIONS.CREATE_FEED), FeedsController.create)


// /api/feeds/:feedid
apiRoutes.route('/feeds/:feedid')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEW_FEED), FeedsController.getById)
  .delete(AuthRequired, CheckPermissions(PERMISSIONS.DELETE_FEED), FeedsController.delete)


// /api/users
apiRoutes.route('/users')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEW_USER), UsersController.getAll)
  .post(AuthRequired, CheckPermissions(PERMISSIONS.CREATE_USER), UsersController.addNewUser)


// /api/users/:userid
apiRoutes.route('/users/:userid')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEW_USER), UsersController.getById)
  .delete(AuthRequired, CheckPermissions(PERMISSIONS.DELETE_USER), UsersController.delete)


// /api/dashboard-info
apiRoutes.route('/dashboard-info')
  .get(AuthRequired, DashboardController.info)


/* /api/feeds/:feedid/run-import */
apiRoutes.route('/feeds/:feedid/run-import')
  .post(AuthRequired, FeedsController.runImport)


apiRoutes.route('/jobs')
  .get(AuthRequired, JobsController.getAll)


apiRoutes.route('/feeds/:feedid/mappings')
  .get(AuthRequired, MappingController.getMappings)


apiRoutes.route('/feeds/:feedid/source-fields')
  .get(AuthRequired, JobsController.getSourceFields)


module.exports = {
  apiRoutes
}