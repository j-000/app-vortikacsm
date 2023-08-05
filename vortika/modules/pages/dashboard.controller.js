const JobsService = require('../jobs/job.service');
const UserService = require('../users/user.service');
const FeedService = require('../feeds/feed.service');
const PageService = require('./page.service');


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
      // Get all themes count
      const totalThemes = (await PageService.getMany({ orgid, fileType: 'theme' })).length;
      res.status(200).json({totalFeeds, totalUsers, totalJobs, totalThemes});
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}


module.exports = {
  DashboardController
}