const express = require('express');
const jobViews = express.Router()
const { AuthRequired } = require('../../middlewares/authentication');
const { HasPermissions } = require('../../middlewares/permissions');
const { JobsController } = require('./job.controller');
const { PERMISSIONS } = require('../permissions/permission.model');
const _P = PERMISSIONS;

/**
 * /api/jobs?page= - Get all jobs for orgid of user logged in
 */
jobViews.route('/jobs')
  .get(AuthRequired, JobsController.getAll);


jobViews.route('/feeds/:feedid/source-fields')
  .get(AuthRequired, HasPermissions(_P.READ_FEED), JobsController.getSourceFields);

  
module.exports = {
  jobViews
}