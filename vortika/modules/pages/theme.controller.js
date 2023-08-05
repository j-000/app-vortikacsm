const path = require('path');
const PageService = require('../pages/page.service')
const fs = require('fs');

class ThemesController {
  static async getAll(req, res) {
    try {
      const orgid = req.user.orgid;
      const themes = await PageService.getMany({ orgid, fileType: 'theme' });
      res.json({ success: true, themes })
    } catch (error) {
      res.json({ error: 'Error getting themes.' })
    }
  }
  static async create(req, res) {
    try {
      const { name } = req.body;
      const isNameValid = /^[a-z\d]+\.html$/gi.test(name);
      if (isNameValid) { 
        const orgid = req.user.orgid;
        const status = 'draft';
        const fileType = 'theme';
        const createdBy = req.user.name;
        const exists = await PageService.getOne({ name });
        if (exists) {
          res.json({error: 'Theme already exists with this name.'});
        } else {

          const TEMPLATES_ROOT = req.app.get('TEMPLATES_ROOT');
          const defaultThemePath = path.join(TEMPLATES_ROOT, '_default', '/theme.html');
          const draftsPath = path.join(TEMPLATES_ROOT, `/draft/${name}`);
          
          fs.copyFile(defaultThemePath, draftsPath, async (err) => {
            if (err) {
              console.log(err);
              res.json({ error: 'Error creating theme.'})
            } else {
              const newTheme = await PageService.create({orgid, filepath: draftsPath, name, status, createdUser: createdBy, fileType});
              res.json({ success: true, message: 'Theme added.' })
            }
          })
        }
      } else {
        res.json({error: 'Invalid name for Theme. '}) 
      }
    } catch(error) {
      res.json({ error: error.message })
    }
  }
}

module.exports = {
  ThemesController
}