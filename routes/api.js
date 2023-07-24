const express = require('express');
const apiRoutes = express.Router()
const { FeedsController } = require('../controllers/feeds');
const { UsersController } = require('../controllers/users');
const { AuthRequired } = require('../middlewares/authentication');
const { CheckPermissions, PERMISSIONS } = require('../middlewares/permissions');
const { AuthenticationController } = require('../controllers/authentication');
const { DashboardController } = require('../controllers/dashboard');
const { ImportsController } = require('../controllers/imports');
const { JobsController } = require('../controllers/jobs');
const { MongoDB } = require('../database/mongo');
const { ObjectId } = require('mongodb');


/* /api/register */
apiRoutes.route('/register')
  .post(UsersController.register)


// /api/login
apiRoutes.route('/login')
  .post(AuthenticationController.login);


// /api/logout
apiRoutes.route('/logout')
  .get(AuthenticationController.logout);


// /api/feeds
apiRoutes.route('/feeds')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWFEED), FeedsController.getAll)
  .post(AuthRequired, CheckPermissions(PERMISSIONS.CREATEFEED), FeedsController.create)


// /api/feeds/:feedid
apiRoutes.route('/feeds/:feedid')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWFEED), FeedsController.getById)
  .delete(AuthRequired, CheckPermissions(PERMISSIONS.DELETEFEED), FeedsController.delete)


// /api/users
apiRoutes.route('/users')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWUSER), UsersController.getAll)
  .post(AuthRequired, CheckPermissions(PERMISSIONS.CREATEUSER), UsersController.addNewUser)


// /api/users/:userid
apiRoutes.route('/users/:userid')
  .get(AuthRequired, CheckPermissions(PERMISSIONS.VIEWUSER), UsersController.getById)
  .delete(AuthRequired, CheckPermissions(PERMISSIONS.DELETEUSER), UsersController.delete)


// /api/dashboard-info
apiRoutes.route('/dashboard-info')
  .get(AuthRequired, DashboardController.info)


/* /api/feeds/:feedid/run-import */
apiRoutes.route('/feeds/:feedid/run-import')
  .post(AuthRequired, ImportsController.runImport)


apiRoutes.route('/jobs')
  .get(AuthRequired, JobsController.getAll)


apiRoutes.route('/feeds/:feedid/field-mapping')
  .get(AuthRequired, async (req, res) => {
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    try {
      const db = await MongoDB.getdb();
      const anyjob = await db.collection('jobs')
        // exclude importer added keys (_id, orgid, feedid)
        .find({ orgid, feedid }, {projection: {_id: 0, orgid: 0, feedid: 0}})
        .limit(1)
        .toArray();

      if (anyjob.length > 0) {
        // Don't send _id, feedid
        const mappings = await db.collection('mappings').findOne({ feedid }, {projection: {_id: 0, feedid: 0}});
        const sourceFields = Object.keys(anyjob[0]);
        res.json({ mappings, sourceFields })
      } else {
        res.json({error: 'No jobs have yet been imported.'})
      }

    } catch (error) {
      res.json(error);
    }
  })


module.exports = {
  apiRoutes
}