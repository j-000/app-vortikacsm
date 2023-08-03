const express = require('express');
const apiRoutes = express.Router()
const { FeedsController } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { DashboardController } = require('../controllers/dashboard');
const { JobsController } = require('../controllers/jobs');
const { MappingController } = require('../controllers/mapping');
const { PagesController } = require('../controllers/page');
const { RolesController } = require('../controllers/role');
const { PermissionsController } = require('../controllers/permissions');
const { HasPermissions } = require('../middlewares/permissions');
const { PERMISSIONS } = require('../models/permission');
const _P = PERMISSIONS;
/**
 * 
 * /api/register          - Register
 * /api/recover-password  - Recover Password
 * /api/login             - Login
 * 
 */

apiRoutes.route('/register')
  .post(UsersController.register)

apiRoutes.route('/login')
  .post(UsersController.login);



/**
 * 
 * /api/feeds                        - Create one and Get all feeds
 * /api/feeds/:feedid                - Get feed details, delete feed 
 * /api/feeeds/:feedid/mappings      - Get, Update feed mappings 
 * /api/feeeds/:feedid/source-fields - Get, Update feed source fields
 * /api/feeds/:feedid/run-import     - Trigger feed import process
 * 
 */

apiRoutes.route('/feeds')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), FeedsController.getAll)
  .post(AuthRequired, HasPermissions(_P.CREATE_FEED), FeedsController.create)

apiRoutes.route('/feeds/:feedid')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), FeedsController.getById)
  .delete(AuthRequired, HasPermissions(_P.DELETE_FEED), FeedsController.delete)

apiRoutes.route('/feeds/:feedid/source-fields')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), JobsController.getSourceFields)

apiRoutes.route('/feeds/:feedid/run-import')
  .post(AuthRequired, HasPermissions(_P.UPDATE_FEED), FeedsController.runImport)


  
/**
 * 
 *  /api/mappings
 *  /api/mappings/:feedid
 * 
 */
apiRoutes.route('/mappings')
  .get(AuthRequired, HasPermissions(_P.UPDATE_FEED), MappingController.getAll)

apiRoutes.route('/mappings/feed/:feedid')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), MappingController.getByFeedid)
  .post(AuthRequired, HasPermissions(_P.UPDATE_FEED), MappingController.update)



/**
 * 
 * /api/dashboard-info - Get dashboard stats 
 * 
 */

apiRoutes.route('/dashboard-info')
  .get(AuthRequired, DashboardController.info)



/**
 * 
 * /api/jobs?page= - Get all jobs for orgid of user logged in
 * 
 */

apiRoutes.route('/jobs')
  .get(AuthRequired, JobsController.getAll)



/**
 * 
 * /api/users          - Get all users for orgid of user logged in
 * /api/users/:userid  - Get user details
 * 
 */

apiRoutes.route('/users')
  .get(AuthRequired, UsersController.getAll)
  .post(AuthRequired, UsersController.addNewUser)

apiRoutes.route('/users/:userid')
  .get(AuthRequired, UsersController.getById)
  .delete(AuthRequired, UsersController.delete)

/**
 * 
 * /api/roles
 * 
 * 
 */
apiRoutes.route('/roles')
  .get(AuthRequired, RolesController.getAll)
  .post(AuthRequired, RolesController.update)



/**
 * 
 * /api/permissions
 * 
 * 
 */
apiRoutes.route('/permissions')
  .get(AuthRequired, PermissionsController.getAll)


  


/**
 * 
 * /api/cms/pages/list?status=           - Get pages; Add template
 * /api/cms/pages/:templateid            - Get the template HTML in json response
 * /api/cms/pages/:templateid/preview    - Preview template
 */

apiRoutes.route('/cms/pages/list')
  .get(AuthRequired, PagesController.getPage)
  .post(AuthRequired, PagesController.createPage)

  
apiRoutes.route('/cms/pages/:pageid')
  .get(AuthRequired, PagesController.getPageHtml)
  .post(AuthRequired, PagesController.publishPage)
  .put(AuthRequired, PagesController.updatePageHtml)

  
module.exports = {
  apiRoutes
}