const { MongoDB } = require("../database/mongo");


class JobsController {
  static async getAll(req, res) {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = 25;
    const skip = (currentPage - 1) * pageSize;
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const jobsCollection = db.collection('jobs');
      const totalJobs = (await jobsCollection.find({ orgid }).toArray()).length;
      const totalPages = Math.ceil(totalJobs / pageSize);
      const allJobs = await jobsCollection.find({ orgid }).skip(skip).limit(pageSize).toArray();
      res.json({ allJobs, totalPages, currentPage })
    } catch (e) {
      console.log(e);
      res.json({ error: 'Error getting jobs.' })
    }
  }
}

module.exports = {
  JobsController
}