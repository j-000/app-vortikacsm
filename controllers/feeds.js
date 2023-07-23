const { MongoDB } = require('../database/mongo');
const { ObjectId } = require('mongodb');
const { Feed } = require('../models/feed');


class FeedsController {

  static async create(req, res){
    const orgid = req.user.orgid;
    const { name, url, type} = req.body;

    // Check data required is available
    if (!name || !url || !type) {
      res.status(400).json({ error: 'Missing data to create feed. '});
      return
    }

    // Create new feed and save
    const newFeed = new Feed(name, url, type, orgid).toJSON();

    try {
      const db = await MongoDB.getdb();
      const feedsCollection = db.collection('feeds');
      const result = await feedsCollection.insertOne(newFeed);
      res.status(201).json({success: true});
      MongoDB.closedb();
    } catch (error) {
      res.status(500).json({error: 'Server error.'});
    }
  }

  static async getAll(req, res) {
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const feedsCollection = db.collection('feeds');
      let feeds = await feedsCollection.find({ orgid }).toArray();
      res.status(200).json({feeds});
      MongoDB.closedb();
    } catch (err) {
      res.json({ error: 'Server error.' });
    }
  }
  
  static async getById(req, res) {
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const feedsCollection = db.collection('feeds');
      const _id = new ObjectId(req.params.feedid);
      const feed = await feedsCollection.findOne({ orgid, _id });
      res.json({feed});
      MongoDB.closedb();
    } catch (err) {
      res.json({ error: err });
    }
  }
  
  static async update(req, res){

  }

  static async delete(req, res){
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const feedsCollection = db.collection('feeds');
      const _id = new ObjectId(req.params.feedid);
      const feed = await feedsCollection.findOneAndDelete({ orgid, _id });
      res.json({success: true});
      MongoDB.closedb();
    } catch (err) {
      res.json({ error: err });
    }
  }

}


module.exports = {
  FeedsController
}