const express = require('express');
const pageViews = express.Router()
const { AuthRequired } = require('../../middlewares/authentication');
const { PagesController } = require('./page.controller');
const { ThemesController } = require('./theme.controller');
const { DashboardController } = require('./dashboard.controller');
const { HasPermissions } = require('../../middlewares/permissions');
const { PERMISSIONS } = require('../permissions/permission.model');
const _P = PERMISSIONS;


/**
 * /api/cms/pages?status=       - Get pages; Add pages;
 * /api/cms/pages/:pageid       - Get the page HTML; Publish page; UpdatePageHtml;
 */

pageViews.route('/cms/pages')
  .get(AuthRequired, HasPermissions(_P.READ_PAGE), PagesController.getPages)
  .post(AuthRequired, HasPermissions(_P.CREATE_PAGE), PagesController.createPage)

  
pageViews.route('/cms/pages/:pageid')
  .get(AuthRequired, HasPermissions(_P.READ_PAGE), PagesController.getPageHtml)
  .post(AuthRequired, HasPermissions(_P.PUBLISH_PAGE), PagesController.publishPage)
  .put(AuthRequired, HasPermissions(_P.UPDATE_PAGE), PagesController.updatePageHtml)


pageViews.route('/cms/themes')
  .get(AuthRequired,ThemesController.getAll)
  .post(AuthRequired, ThemesController.create)

pageViews.route('/dashboard-info')
  .get(AuthRequired, DashboardController.info)

module.exports = {
  pageViews
}