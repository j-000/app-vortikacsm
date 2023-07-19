const { MongoDB } = require('../services/mongo');

class FeedsController {
  static async getFeeds(req, res) {
    try {
      const db = await MongoDB.getdb();
      const feedsCollection = db.collection('feeds');
      const feeds = await feedsCollection.find({ name: 'bu' }).toArray();

      res.json(feeds);

      MongoDB.closedb();
    } catch (err) {
      console.error(`Error: ${err}`);
      res.json({ error: err });
    }
  }

}

module.exports = {
  FeedsController
}