const { MongoDB } = require('../database/mongo');
const { ObjectId } = require('mongodb');
const { Feed } = require('../models/feed');
const { getMappingsTemplateObject } = require('../models/mappings');
const { importJobs } = require('../services/importer');
const FeedService = require('../database/services/feeds');


class FeedsController {

  static async create(req, res){
    const orgid = req.user.orgid;
    const { name, url, type, firstElementKey, dataType} = req.body;
    try {      
      const result = await FeedService.create(name, url, type, firstElementKey, dataType, orgid);
      res.status(201).json({success: true});
    } catch (error) {
      res.status(500).json({error: 'Server error.'});
    }
  }

  static async getAll(req, res) {
    const orgid = req.user.orgid;
    try {
      let feeds = await FeedService.getMany({ orgid }, {projection: {_id: 1, name: 1}});
      res.status(200).json({feeds});
    } catch (err) {
      res.json({ error: 'Server error.' });
    }
  }
  
  static async getById(req, res) {
    const orgid = req.user.orgid;
    try {
      const _id = new ObjectId(req.params.feedid);
      const feed = await FeedService.getOne({ orgid, _id });
      
      // TODO: implement jobs model and service 
      // const totalFeedJobs = (await db.collection('jobs').find({ feedid: _id }).toArray()).length
      const totalFeedJobs = 0

      res.json({feed:{ ...feed, totalFeedJobs}});
    } catch (err) {
      res.json({ error: err });
    }
  }
  
  static async update(req, res){
    // TODO: implement this
  }

  static async delete(req, res){
    const orgid = req.user.orgid;
    try {
      const _id = new ObjectId(req.params.feedid);
      const feed = await FeedService.remove({ orgid, _id });
      res.json({success: true});
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
      // Check if feed exists
      const feed = await FeedService.getOne({ _id, orgid});
      if (feed) {
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