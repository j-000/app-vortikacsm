const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const TemplateService = require('../database/services/template');

class TemplateController {

  static async getTemplate(req, res){
    const orgid = req.user.orgid;
    const type = req.query.type.toLowerCase();
    const isValidType = ['all', 'bjdp', 'ajdp', 'srp'].includes(type);
    if (!isValidType){
      res.json({error: 'Not valid ?type= parameter.'})
    } else {
      try {
        let filter = { orgid, type };
        if (type == 'all') {
          filter = { orgid }
        }
        const templates = await TemplateService.getMany(filter, {__v: 0, filepath: 0});
        res.json({ templates });
      } catch (error) {
        console.log(error);
        res.json({ error });
      } 
    }
  }

  static async getTemplateHTML(req, res){
    const orgid = req.user.orgid;
    const fileid = new ObjectId(req.params.templateid);
    try {
      const template = await TemplateService.getOne({ _id: fileid, orgid });
      if (!template) {
        res.json({error: 'No file found'}); 
        return 
      }
      fs.readFile(template.filepath, 'utf-8', (err, data) => {
        if(err){
          res.json({error: 'Error getting template.'})
        } else {
          res.json({ templateContent: data });
        }
      })
    } catch (error) {
      console.log(error);
      res.json({ error });
    } 
  }
  
  static async createTemplate(req, res){
      const orgid = req.user.orgid;
      const name = req.body.filename;
      const type = req.body.type.toLowerCase();

      // Check filename and folder is valid
      const validFileName = /[a-zA-Z_]+/gi.test(name);
      const validTemplateType = ['ajdp', 'bjdp', 'srp'].includes(type);
      if (!validFileName || !validTemplateType) {
        res.json({error: 'Invalid file name. Only "a-z", "A-Z" or "_" allowed.'})
      } else {
        const filepath = path.join(__dirname, '../templates/', type ,`${name}.html`);
        try{
          // Create TemplateModel doc to keep track of file changes.
          const templateStats = TemplateService.create(orgid, filepath, name, type);
        } catch (error) {
          res.json({error});
          return;
        }
        const placeholderHTML = `<h1>VortikaCSM - Your new page is ready!</h1>`;
        fs.writeFile(filepath, placeholderHTML, (err) => {
          if (err) {
            res.json({error: 'Error creating file.'})
          } else {
            res.json({success: true, message: 'File created.'})
          }
        });
      }   
  }
}


module.exports = {
  TemplateController
}