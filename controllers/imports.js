const { MongoDB } = require('../database/mongo');
const { ObjectId } = require('mongodb');
const { importJobs } = require('../services/importer');


class ImportsController {
  static async runImport(req, res) {
    const orgid = req.user.orgid;
    let _id;
    
    try {
      _id = new ObjectId(req.params.feedid);
    } catch (err) {
      res.status(400).json({error: 'Invalid feedid.'})
      return
    }

    try {
      const db = await MongoDB.getdb();
      const feedsCollection = db.collection('feeds');

      // Check if feed exists
      const feed = await feedsCollection.findOne({ _id, orgid});
      if (feed) {
        MongoDB.closedb()
        importJobs(feed)
        res.status(200).json({ success: 'Import started.' });
      } else {
        res.status(404).json({error: 'No feed found.'})
      }

    } catch (error) {
      res.status(500).json({ error });
    }
  }

}


module.exports = {
  ImportsController
}