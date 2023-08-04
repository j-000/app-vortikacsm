const express = require('express');
const coreRoutes = express.Router()
const { ObjectId } = require('mongodb');
const JobService = require('../database/services/jobs');
const PageService = require('../database/services/page');
const MappingService = require('../database/services/mappings');

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
        const jobDetailsPage = await PageService.getOne({ orgid: req.params.orgid, fileType: 'job-details' });
        // check page is published to subdomain
        if (jobDetailsPage.status == req._subdomain) {
          if (jobDetailsPage) {
            const feedid = new ObjectId(job.feedid);
            const jobMappings = await MappingService.getOne({ feedid });
            let context = {};
            // convert the jobs props
            // to a context object based on the mappings fields.
            Object.keys(jobMappings.props).forEach(jmp => {
              // jmp => (id, title, description, apply_url, array_one, etc.)
              const mappedField = jobMappings.props[jmp].mappedTo.sourceField;
              context[jmp] = job.props[mappedField]
            });
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