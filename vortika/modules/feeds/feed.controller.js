const { ObjectId } = require('mongodb');
const JobsService = require('../jobs/job.service');
const FeedService = require('../feeds/feed.service');
const MappingsService = require('../mappings/mapping.service');
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
    const orgid = req.user.org;
    const feedid = new ObjectId(req.params.feedid);
    const {cron, sourceFields, lastImport} = req.body;
    const obj = {};
    if (cron){
      obj.cron = cron
    }
    if (sourceFields){
      obj.sourceFields = sourceFields
    }
    if (lastImport) {
      obj.lastImport = lastImport
    }
    if (Object.keys(obj).length == 0) {
      res.json({error: 'Nothing to udpate.'});
      return
    }
    try {
      await FeedService.update({ _id: feedid}, obj);
      res.json({success: true, message: 'Feed udpated.'});
    } catch(error){ 
      res.json({error: 'Error updating the feed.'})
    }
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
    const { feedid } = req.params;
    const orgid = req.user.orgid;
    const _id = new ObjectId(feedid);
    const feed = await FeedService.getOne({ _id });

    if (feed) {
      if (feed.cron !== null) {
        jobsQ.add(`Feed: ${feed.name}`, { feedid, orgid }, { repeat: {pattern: feed.cron }});
        res.send({success: true, message: `Scheduled import started for feed ${feed.name}.`})
      } else {
        jobsQ.add(`Feed: ${feed.name}`, { feedid, orgid });
        res.send({success: true, message: `Manual import started for feed ${feed.name}. No cron set.`})
      }
    } else {
      res.send({error: 'No such feed.'})
    }
  }
}


module.exports = {
  FeedsController
}