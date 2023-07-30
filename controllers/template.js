const { ObjectId } = require('mongodb');
const fs = require('fs');
const fsX = require('fs-extra');
const path = require('path');
const TemplateService = require('../database/services/template');
const UserService = require('../database/services/user');

class TemplateController {

  static async getTemplate(req, res){
    const orgid = req.user.orgid;
    
    let status = req.query.status.toLowerCase(); 
    const isValidStatus = ['draft', 'preview', 'live'].includes(status);

    if (!isValidStatus){
      res.json({error: 'Not valid ?type= parameter.'})
    } else {
      try {
        if (status == 'live') status = 'public';
        let filter = { status };
        const templates = await TemplateService.getMany(filter, {__v: 0, filepath: 0});
        res.json({ templates });
      } catch (error) {
        console.log(error);
        res.json({ error });
      } 
    }
  }

  static async getPageHtml(req, res){
    const orgid = req.user.orgid;
    const _id = new ObjectId(req.params.pageid);
    try {
      const file = await TemplateService.getOne({ _id });
      if (!file) {
        res.json({error: 'No file found'}); 
        return 
      }
      // Prevent users from editing same file.
      if (file.fileLocked){
        const fileLockedEditorMessage = `
        ***************************************
        *                                     *
        * THIS FILE IS LOCKED BY ${file.fileLockedBy} *
        *                                     *
        ***************************************
        `
        res.json({error: `This file is locked by ${file.fileLockedBy}.`, fileContent: fileLockedEditorMessage});
        return
      }

      fs.readFile(file.filepath, 'utf-8', async (err, fileContent) => {
        if(err){
          res.json({error: 'Error getting template.'})
        } else {
          const lockFile = await TemplateService.updateOne({ _id }, {fileLocked: true, fileLockedBy: req.user.name})
          res.json({ fileContent });
        }
      })

    } catch (error) {
      res.json({ error });
    } 
  }
  
  static async createTemplate(req, res){
      const orgid = req.user.orgid;
      const name = req.body.name;
      const status = req.body.status;

      // Check filename and folder is valid
      const isValidName = /[a-zA-Z\d_]+\.html/gi.test(name);
      const isValidSatus = ['draft', 'preview', 'live', 'public'].includes(status);
      
      // TODO: Check name isn't taken - should not happen to have 2 files with same name in
      // draft and in preview.
 
      if (!isValidName || !isValidSatus) {
        res.json({error: 'Only letters (a-z A-Z), numbers (0 - 9) or "_" allowed. Example: about.html'})
      } else {
        const filepath = path.join(__dirname, '../templates/', status ,`${name}`);
        try{
          // Create TemplateModel doc to keep track of file changes.
          const user = await UserService.getOne({ _id: new ObjectId(req.user.userid)});
          const createdUser = user.name;
          const templateStats = await TemplateService.create(orgid, filepath, name, status, createdUser);
        } catch (error) {
          res.json({error});
          return;
        }
        const placeholderHTML = `<h1>VortikaCSM - Your new draft page is ready!</h1>`;
        fs.writeFile(filepath, placeholderHTML, (err) => {
          if (err) {
            res.json({error: 'Error creating file.'})
          } else {
            res.json({success: true, message: 'File created.'})
          }
        });
      }   
  }

  static async updatePageHtml(req, res){
    const orgid = req.user.orgid;
    try {
      const newContent = req.body.newContent;
      const _id = new ObjectId(req.params.pageid);

      // Update file in filesystem
      const fileDoc = await TemplateService.getOne({ _id });

      fs.writeFile(fileDoc.filepath, newContent, { encoding: 'utf-8', flag: 'w' }, (err) => {
        if (err) {
          res.json({erro: 'Error saving file.'})
        }
      });

      // Update template doc
      const updated = await TemplateService.updateOne({ _id }, { 
        fileLocked: false, fileLockedBy: '', lastEdited: { timestamp: Date.now(), byUser: req.user.name } });
      
      
        res.json({ success: true, message: 'File saved successfully.' })
    } catch(error) {
      console.log(error);
      res.json({error});
    }
  }

  static async publishPage(req, res){
    const orgid = req.user.orgid;

    try {
      const publish = req.body.publish;
      const _id = new ObjectId(req.params.pageid);
      const fileDoc = await TemplateService.getOne({ _id });

      if (publish === 'preview') {

        // Move file from drafts to preview folder
        const newFilePath = path.join(__dirname, '../templates/preview/', fileDoc.name);
        fsX.move(fileDoc.filepath, newFilePath, (err) => {
          if (err) {
            res.json({error: 'Error publishing file.'});
            return
          }
        })

        // Update file doc in db
        const updated = await TemplateService.updateOne({ _id }, {
          filepath: newFilePath, status: publish, lastPublished: { timestamp : Date.now(), to: publish, byUser: req.user.name }
        })

        res.json({success: true, message: 'File published successfully to preview.'})
      } else if (publish === 'live') {
        // more convoluted as needed to have 2 versions.

      } else {
        res.json({ error: 'Not valid publish flag. '});
        return
      }

    } catch (error) {
      res.json({error})
    }

  }
}


module.exports = {
  TemplateController
}