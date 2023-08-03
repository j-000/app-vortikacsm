const { ObjectId } = require('mongodb');
const JobsService = require('../database/services/jobs');
const FeedService = require('../database/services/feeds');
const MappingsService = require('../database/services/mappings');
const { Queue } = require('bullmq');

const jobsQ = new Queue('Imports', { connection : {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}})


class FeedsController {

  static async create(req, res){
    const orgid = req.user.orgid;
    const { name, url, type, firstElementKey, dataType} = req.body;
    try {      
      const newFeed = await FeedService.create(name, url, type, firstElementKey, dataType, orgid);
      const feedid = new ObjectId(newFeed._id);
      const newMappings = await MappingsService.create(feedid, orgid);
      res.status(201).json({success: true});
    } catch (error) {
      res.status(500).json({error: 'Server error.'});
    }
  }

  static async getAll(req, res) {
    const orgid = req.user.orgid;
    try {
      let feeds = await FeedService.getMany({ orgid }, {_id: 1, name: 1});

      res.status(200).json({feeds});
    } catch (err) {
      console.log(err);
      res.json({ error: 'Server error.' });
    }
  }
  
  static async getById(req, res) {
    const orgid = req.user.orgid;
    try {
      const _id = new ObjectId(req.params.feedid);
      const feed = await FeedService.getOne({ orgid, _id }, {__v: 0});
      const totalFeedJobs = (await JobsService.getMany({ feedid: _id })).length;
      res.json({feed: {...feed.toJSON(), totalFeedJobs}});
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
    // const orgid = req.user.orgid;


    jobsQ.add(`Feed-${req.params.feedid}`, { feedid: req.params.feedid});
    res.send({success: true})
    // let _id;
    // try {
    //   _id = new ObjectId(req.params.feedid);
    // } catch (err) {
    //   res.status(400).json({error: 'Invalid feedid.'})
    //   return
    // }

    // let startRun = false;
    // try {
    //   // Check if feed exists
    //   const feed = await FeedService.getOne({ _id, orgid});
    //   if (feed) {
    //     // Check feed has not run in the last 1h
    //     if (feed.lastImport){
    //       const oneHourInMs = 3600000;
    //       const differenceMs = Date.now() - feed.lastImport;
    //       if (differenceMs < oneHourInMs) {
    //         res.status(403).json({ error: 'Importer run less than 1h ago.'})
    //         return
    //       } else {
    //         startRun = true;
    //         res.status(200).json({ success: 'Import started.' });
    //       }

    //     } else {
    //       startRun = true;
    //       res.status(200).json({ success: 'Import started.' });
    //     }

    //     // Start Importer
    //     if (startRun) {
    //       importJobs(feed, orgid)
    //     };

    //   } else {
    //     res.status(404).json({ error: 'No feed found.' })
    //   }

    // } catch (error) {
    //   res.status(500).json({ error });
    // }
  }

}


module.exports = {
  FeedsController
}