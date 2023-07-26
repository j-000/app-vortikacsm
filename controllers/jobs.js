const { ObjectId } = require("mongodb");
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

  static async getSourceFields(req, res){
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    console.log(orgid, feedid);
    const db = await MongoDB.getdb()
    const anyjob = await db.collection('jobs')
      // exclude importer added keys (_id, orgid, feedid)
      .find({ orgid, feedid }, { projection: { _id: 0, orgid: 0, feedid: 0 } })
      .limit(1)
      .toArray();

      if (anyjob.length > 0) {
        // Don't send _id, feedid
        const sourceFields = Object.keys(anyjob[0]);
        res.json({ sourceFields })
      } else {
        res.json({ error: 'No jobs have yet been imported.'})
      }
  }
}

module.exports = {
  JobsController
}