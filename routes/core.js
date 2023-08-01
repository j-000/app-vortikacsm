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
    const templateDoc = await PageService.getOne({ urlslug });
    // Default template (404.html)
    let notFoundTemplate = "404.html";
    let templateName = "";
    // Context obj
    let context = {};
    if (templateDoc) {
      // Check status as templates may not be published (preview or live);
      if (templateDoc.status === req._subdomain) {
        // Template is allowed to be shown on domain
        templateName = templateDoc.name;
        // Update context acordingly 
        context = {}
      } else {
        // Template exists but it's not published in subdomain requested
        templateName = notFoundTemplate;
      }
    } else {
      // Template doesn't exist with this urlslug
      templateName = notFoundTemplate;
    }
    // Render response
    res.render(`${req._subdomain}/${templateName}`, context);
})

module.exports = {
  coreRoutes
}