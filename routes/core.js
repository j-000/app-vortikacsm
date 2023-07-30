const express = require('express');
const coreRoutes = express.Router()
const TemplateService = require('../database/services/template')


coreRoutes.route('/')
  .get((req, res) => {
    const templateName = 'index.html';
    res.render(`${req._subdomain}/${templateName}`, {});
  })


coreRoutes.route('/:contentPage')
  .get(async (req, res) => {
    // Check file exist (two ways to do this: check dp templates collection
    // or check the dir by reading the file system )
    const templateDoc = await TemplateService.getOne({ name: { $regex: req.params.contentPage, $options: 'i' } });
    let templateName = "404.html";
    let context = {};

    if (templateDoc) {
      // Check status as templates may not be published (preview or live);
      if (templateDoc.status === req._subdomain) {
        // Template is allowed to be shown on domain
        templateName = templateDoc.name;

        context = {}
      }

    }

    res.render(`${req._subdomain}/${templateName}`, context);

  })


module.exports = {
  coreRoutes
}