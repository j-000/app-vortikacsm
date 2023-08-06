const express = require('express');
const feedViews = express.Router()
const { FeedsController } = require('./feed.controller');
const { AuthRequired } = require('../../middlewares/authentication');
const { HasPermissions } = require('../../middlewares/permissions');
const { PERMISSIONS } = require('../permissions/permission.model');
const _P = PERMISSIONS;


/**
 * /api/feeds                        - Create one and Get all feeds
 * /api/feeds/:feedid                - Get feed details, delete feed 
 * /api/feeeds/:feedid/mappings      - Get, Update feed mappings 
 * /api/feeeds/:feedid/source-fields - Get, Update feed source fields
 * /api/feeds/:feedid/run-import     - Trigger feed import process
 */

feedViews.route('/feeds')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), FeedsController.getAll)
  .post(AuthRequired, HasPermissions(_P.CREATE_FEED), FeedsController.create)

feedViews.route('/feeds/:feedid')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), FeedsController.getById)
  .post(AuthRequired, HasPermissions(_P.UPDATE_FEED), FeedsController.update)
  .delete(AuthRequired, HasPermissions(_P.DELETE_FEED), FeedsController.delete)

feedViews.route('/feeds/:feedid/run-import')
  .post(AuthRequired, HasPermissions(_P.UPDATE_FEED), FeedsController.runImport)
  
module.exports = {
    feedViews
}