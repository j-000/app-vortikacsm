const express = require('express');
const coreRoutes = express.Router()
const PageService = require('../database/services/page')


coreRoutes.route('/')
  .get((req, res) => {
    const templateName = 'index.html';
    res.render(`${req._subdomain}/${templateName}`, {});
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