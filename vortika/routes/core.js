const express = require('express');
const coreRoutes = express.Router()
const { ObjectId } = require('mongodb');
const JobService = require('../modules/jobs/job.service');
const PageService = require('../modules/pages/page.service');
const MappingService = require('../modules/mappings/mapping.service');

// TODO: Create controllers for these routes

// Remember:
/**
 * 
 * _subdomain is one of (preview | public) and 
 * these are the folders in views/.
 * views/ has been set as the views folder in nunjucks config
 *  
 */

coreRoutes.route('/')
  .get((req, res) => {
    const pagename = 'index.html';
    res.render(`${req._subdomain}/${pagename}`, {});
  })


coreRoutes.route('/jobs/:orgid/:jobid')
  .get(async (req, res) => {
    try {
      const _id = new ObjectId(req.params.jobid);
      const job = await JobService.getOne({ _id });
      if(job) {
        // Assume only 1 page exists for now
        const jobDetailsPage = await PageService.getOne({ orgid: req.params.orgid, fileType: 'job-details' });
        if (jobDetailsPage) {
          // check page is published to subdomain
          if (jobDetailsPage.status == req._subdomain ) {
            const context = job.props
            res.render(`${req._subdomain}/${jobDetailsPage.name}`, { ...context })
          } else {
            res.render(`${req._subdomain}/error.html`)
          }
        } else {
          res.render(`${req._subdomain}/error.html`)
        }
      } else {
        res.render(`${req._subdomain}/error.html`)
      }
    } catch (error) {
      res.render(`${req._subdomain}/error.html`);
    }
  })


coreRoutes.route('/search-jobs')
  .get(async (req, res) => {
    const subdomain = req._subdomain;
    const context = {
      jobs: [{name: 'hr recruiter'}]
    }
    res.render(`${subdomain}/search.html`, context)
})

coreRoutes.route('/:urlslug')
  .get(async (req, res) => {   
    // Check file exist with this urlslug
    const urlslug = req.params.urlslug;
    const page = await PageService.getOne({ urlslug });
    if (page) {
      // Check status as templates may not be published (preview or live);
      if (page.status === req._subdomain) {
        // Template is allowed to be shown on domain
        return res.render(`${req._subdomain}/${page.name}`);
      } else {
        // Template exists but it's not published in subdomain requested
        return res.render(`${req._subdomain}/404.html`)
      }
    } else {
      return res.render(`${req._subdomain}/404.html`)
    }
})





module.exports = {
  coreRoutes
}