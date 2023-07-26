const { MongoDB } = require('../database/mongo');
const { ObjectId } = require('mongodb');
const { Feed } = require('../models/feed');
const { getMappingsTemplateObject } = require('../models/mappings');
const { importJobs } = require('../services/importer');


class FeedsController {

  static async create(req, res){
    const orgid = req.user.orgid;

    if (!orgid) {
      res.status(500).json({error: 'Internal server error. Missing orgid. Feed not created.'});
      return
    }

    const { name, url, type, firstElementKey, dataType} = req.body;

    // Check data required is available
    if (!name || !url || !type || !firstElementKey || !dataType) {
      res.status(400).json({ error: 'Missing data to create feed.'});
      return
    }

    // Create new feed and save
    const newFeed = new Feed(name, url, type, orgid, firstElementKey, dataType).toJSON();

    try {
      const db = await MongoDB.getdb();
      // Add new feed
      const feedsCollection = db.collection('feeds');
      const result = await feedsCollection.insertOne(newFeed);
      // Add new mappings template for newly created feed
      const mappings = getMappingsTemplateObject()
      // Insert mapping object tagged with new feed id.
      const result2 = await db.collection('mappings').insertOne({feedid: result.insertedId, ...mappings})
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
      let feeds = await feedsCollection.find({ orgid }, {projection: {_id: 1, name: 1}}).toArray();
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
      const totalFeedJobs = await (await db.collection('jobs').find({ feedid: _id }).toArray()).length
      res.json({feed:{ ...feed, totalFeedJobs}});
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
            importJobs(feed, orgid)
            res.status(200).json({ success: 'Import started.' });
          }

        } else {
          importJobs(feed, orgid)
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
  FeedsController
}