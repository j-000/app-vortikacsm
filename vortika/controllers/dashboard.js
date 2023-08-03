const JobsService = require('../database/services/jobs');
const UserService = require('../database/services/user');
const FeedService = require('../database/services/feeds');

class DashboardController {
  static async info(req, res) {
    // Get logged user orgid from token
    const orgid = req.user.orgid;
    try {
      // Get all users for this orgid
      const totalUsers = (await UserService.getMany({ orgid })).length;
      // Get all feeds for this orgid
      const totalFeeds = (await FeedService.getMany({ orgid })).length;
      // Get all jobs for this orgid
      const totalJobs = (await JobsService.getMany({ orgid })).length;
      res.status(200).json({totalFeeds, totalUsers, totalJobs});
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}


module.exports = {
  DashboardController
}