const express = require('express');
const apiRoutes = express.Router()
const { FeedsController } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { DashboardController } = require('../controllers/dashboard');
const { JobsController } = require('../controllers/jobs');
const { MappingController } = require('../controllers/mapping');
const { PagesController } = require('../controllers/page');



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
  .get(AuthRequired, FeedsController.getAll)
  .post(AuthRequired, FeedsController.create)

apiRoutes.route('/feeds/:feedid')
  .get(AuthRequired, FeedsController.getById)
  .delete(AuthRequired, FeedsController.delete)

apiRoutes.route('/feeds/:feedid/source-fields')
  .get(AuthRequired, JobsController.getSourceFields)

apiRoutes.route('/feeds/:feedid/run-import')
  .post(AuthRequired, FeedsController.runImport)


  
/**
 * 
 *  /api/mappings
 *  /api/mappings/:feedid
 * 
 */
apiRoutes.route('/mappings')
  .get(AuthRequired, MappingController.getAll)

apiRoutes.route('/mappings/feed/:feedid')
  .get(AuthRequired, MappingController.getByFeedid)
  .post(AuthRequired, MappingController.update)



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
 * /api/cms/pages/list?type= ('all', 'bjdp', 'ajdp', 'srp') - Get pages; Add template
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