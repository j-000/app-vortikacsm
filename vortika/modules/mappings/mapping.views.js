const express = require('express');
const mappingViews = express.Router()
const { AuthRequired } = require('../../middlewares/authentication');
const { MappingController } = require('./mapping.controller');
const { HasPermissions } = require('../../middlewares/permissions');
const { PERMISSIONS } = require('../permissions/permission.model');
const _P = PERMISSIONS;

/**
 * 
 *  /api/mappings
 *  /api/mappings/:feedid
 * 
 */
mappingViews.route('/mappings')
  .get(AuthRequired, HasPermissions(_P.UPDATE_FEED), MappingController.getAll)

  
mappingViews.route('/mappings/feed/:feedid')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), MappingController.getByFeedid)
  .post(AuthRequired, HasPermissions(_P.UPDATE_FEED), MappingController.update)


module.exports = {
    mappingViews
}