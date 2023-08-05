const express = require('express');
const permissionView = express.Router()
const { AuthRequired } = require('../../middlewares/authentication');
const { PermissionsController } = require('./permission.controller');
const { PERMISSIONS } = require('./permission.model');
const _P = PERMISSIONS;

/**
 * /api/permissions
 */
permissionView.route('/permissions')
  .get(AuthRequired, PermissionsController.getAll)

  
module.exports = {
  permissionView
}