const { ObjectId } = require("mongodb");
const JobsService = require('./job.service');

class JobsController {

  static async getAll(req, res) {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = 25;
    const skip = (currentPage - 1) * pageSize;
    const orgid = req.user.orgid;
    try {
      const totalJobs = (await JobsService.getMany({ orgid })).length;
      const totalPages = Math.ceil(totalJobs / pageSize);
      const allJobs = await JobsService.getManyPaginated({ orgid }, {}, skip, pageSize);
      
      res.json({ allJobs, totalPages, currentPage })
    } catch (e) {
      res.json({ error: 'Error getting jobs.' })
    }
  }

  static async getAllByFeedId(req, res){
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = 25;
    const skip = (currentPage - 1) * pageSize;
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    try {
      const totalJobs = (await JobsService.getMany({ orgid, feedid })).length;
      const totalPages = Math.ceil(totalJobs / pageSize);
      const allJobs = await JobsService.getManyPaginated({ orgid, feedid }, {}, skip, pageSize);
      res.json({ allJobs, totalPages, currentPage })
    } catch (e) {
      res.json({ error: 'Error getting jobs.' })
    }
  }

  static async addJobs(req, res) {
    try {
      const { orgid, props} = req.body;
      const feedid =new ObjectId(req.body.feedid);
      const feedJob = await JobsService.create(feedid, orgid, props);
      res.json({success: true, feedJob})
    } catch(error) {
      console.log(error);
      res.status(500).json({error: error.message});
    }
  }

  static async getSourceFields(req, res){
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    try {
      const feedJob = await JobsService.getOne({ feedid }, { __v: 0});
      if (feedJob) {
        res.json({success: true, props: Object.keys(feedJob.props), message: ''});
      } else {
        res.json({success: true, props: [], message: 'No jobs have been imported.'});
      }
    } catch(error) {
      res.status(500).json({error: error.message});
    }
  }

  static async deleteByFeedId(req, res) {
    const feedid = new ObjectId(req.params.feedid);
    try {
      const feedJob = await JobsService.removeMany({ feedid });
      res.json({success: true});
    } catch(error) {
      res.status(500).json({error: error.message});
    }
  }
}

module.exports = {
  JobsController
}