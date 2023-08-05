const { ObjectId } = require('mongodb');
const JobsService = require('../jobs/job.service');
const FeedService = require('../feeds/feed.service');
const MappingsService = require('../mappings/mapping.service');
const { Queue } = require('bullmq');
const { importJobs } = require('../../services/importer');

// const jobsQ = new Queue('Imports', { connection : {
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT
// }})


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
    // jobsQ.add(`Feed-${req.params.feedid}`, { feedid: req.params.feedid});
    importJobs(req.params.feedid, req.user.orgid);
    res.send({success: true, message: 'Import started.'})
  }

}


module.exports = {
  FeedsController
}