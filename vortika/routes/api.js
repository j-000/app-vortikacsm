const express = require('express');
const apiRoutes = express.Router()
const { feedViews } = require('../modules/feeds/feed.views');
const { userViews } = require('../modules/users/user.views');
const { roleViews } = require('../modules/roles/role.views');
const { pageViews } = require('../modules/pages/page.views');
const { jobViews } = require('../modules/jobs/job.views');
const { mappingViews } = require('../modules/mappings/mapping.views');
const { permissionView } = require('../modules/permissions/permission.view');


/**
 * /api/feeds                        - Create one and Get all feeds
 * /api/feeds/:feedid                - Get feed details, delete feed 
 * /api/feeeds/:feedid/mappings      - Get, Update feed mappings 
 * /api/feeeds/:feedid/source-fields - Get, Update feed source fields
 * /api/feeds/:feedid/run-import     - Trigger feed import process
 */
apiRoutes.use(feedViews)
  
/**
 *  /api/mappings
 *  /api/mappings/:feedid
 */
apiRoutes.use(mappingViews);

/**
 * /api/jobs?page= - Get all jobs for orgid of user logged in
 */
apiRoutes.use(jobViews)

/**
 * /api/register          - Register
 * /api/recover-password  - Recover Password
 * /api/login             - Login
 * /api/users             - Get all users for orgid of user logged in
 * /api/users/:userid     - Get user details
 */
apiRoutes.use(userViews);

/**
 * /api/roles
 */
apiRoutes.use(roleViews);

/**
 * /api/permissions
 */
apiRoutes.use(permissionView);

/**
 * /api/cms/pages?status=       - Get pages; Add pages;
 * /api/cms/pages/:pageid       - Get the page HTML; Publish page; UpdatePageHtml;
 * /api/cms/themes              - Get themes; Add theme;
*/
apiRoutes.use(pageViews);

  
module.exports = {
  apiRoutes
}