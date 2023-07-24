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

        // Check feed has not run in the last 1h
        if (feed.lastImport){
          const oneHourInMs = 3600000;
          const differenceMs = Date.now() - feed.lastImport;
          if (differenceMs < oneHourInMs) {
            res.status(403).json({ error: 'Importer run less than 1h ago.'})
            return
          } else {
            importJobs(feed)
            res.status(200).json({ success: 'Import started.' });
          }

        } else {
          importJobs(feed)
          res.status(200).json({ success: 'Import started.' });
        }
      
      } else {
        res.status(404).json({ error: 'No feed found.' })
      }

    } catch (error) {
      res.status(500).json({ error });
    }
  }

}


module.exports = {
  ImportsController
}