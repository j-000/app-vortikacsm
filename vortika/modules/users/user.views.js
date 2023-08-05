const express = require('express');
const userViews = express.Router()
const { UsersController } = require('./user.controller');
const { AuthRequired } = require('../../middlewares/authentication');
const { HasPermissions } = require('../../middlewares/permissions');
const { PERMISSIONS } = require('../permissions/permission.model');
const _P = PERMISSIONS;


/**
 * /api/register          - Register
 * /api/recover-password  - Recover Password
 * /api/login             - Login
 */
userViews.route('/register')
  .post(UsersController.register)


userViews.route('/login')
  .post(UsersController.login);


/**
 * /api/users          - Get all users for orgid of user logged in
 * /api/users/:userid  - Get user details
 */
userViews.route('/users')
  .get(AuthRequired, HasPermissions(_P.READ_USER), UsersController.getAll)
  .post(AuthRequired, HasPermissions(_P.CREATE_USER), UsersController.addNewUser)


userViews.route('/users/:userid')
  .get(AuthRequired, HasPermissions(_P.READ_USER), UsersController.getById)
  .delete(AuthRequired,HasPermissions(_P.DELETE_USER), UsersController.delete)


module.exports = {
    userViews
}