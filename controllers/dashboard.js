const { MongoDB } = require('../database/mongo');


class DashboardController {
  static async info(req, res) {
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const totalUsers = (await db.collection('users').find({ orgid }).toArray()).length;
      const feeds = await db.collection('feeds').find({ orgid }).toArray();
      const totalFeeds = feeds.length;
      let totalJobs = 0;
      feeds.forEach( feed => feed.jobs ? totalJobs += feed.jobs.length : '')
      res.status(200).json({totalFeeds, totalUsers, totalJobs});
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}


module.exports = {
  DashboardController
}