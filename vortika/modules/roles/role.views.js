const express = require('express');
const roleViews = express.Router()
const { AuthRequired } = require('../../middlewares/authentication');
const { RolesController } = require('./role.controller');
const { HasPermissions } = require('../../middlewares/permissions');
const { PERMISSIONS } = require('../permissions/permission.model');
const _P = PERMISSIONS;

/**
 * /api/roles
 */
roleViews.route('/roles')
  .get(AuthRequired, HasPermissions(_P.READ_ROLE), RolesController.getAll)
  .post(AuthRequired, HasPermissions(_P.UPDATE_ROLE), RolesController.update)

module.exports = {
    roleViews
}