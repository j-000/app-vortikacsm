const { ObjectId } = require('mongodb');
const fs = require('fs');
const fsX = require('fs-extra');
const path = require('path');
const PageService = require('../database/services/page');
const UserService = require('../database/services/user');

class PagesController {

  static async getPage(req, res){
    const orgid = req.user.orgid;
    
    let status = req.query.status.toLowerCase(); 
    const isValidStatus = ['draft', 'preview', 'live'].includes(status);

    if (!isValidStatus){
      res.json({error: 'Not valid ?type= parameter.'})
    } else {
      try {
        if (status == 'live') status = 'public';
        let filter = { status, fileType: {$not : {$regex: 'theme'} }};
        const templates = await PageService.getMany(filter, {__v: 0, filepath: 0});
        res.json({ templates });
      } catch (error) {
        res.json({ error });
      } 
    }
  }

  static async getPageHtml(req, res){
    const orgid = req.user.orgid;
    const _id = new ObjectId(req.params.pageid);
    try {
      const file = await PageService.getOne({ _id });
      if (!file) {
        res.json({error: 'No file found'}); 
        return 
      }
      // Prevent users from editing same file.
      if (file.fileLocked && file.fileLockedBy !== req.user.name){
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
          const lockFile = await PageService.updateOne({ _id }, {fileLocked: true, fileLockedBy: req.user.name})
          res.json({ fileContent });
        }
      })

    } catch (error) {
      res.json({ error: error.message });
    } 
  }
  
  static async createPage(req, res){
    const orgid = req.user.orgid;
    const status = 'draft';
    let { fileType, urlslug, name } = req.body;

    // validate data
    const isValidName = /^[a-zA-Z\d_]+\.html$/gi.test(name);
    const isNameTaken = await PageService.getOne({ name });
    const isValidfileType = ['content', 'homepage', 'job-details', 'search-results'].includes(fileType);
   
    // Hanlde invalid data
    if (isNameTaken) {
      return res.json({error: `Already exists a page named "${name}".`});
    }
    if (!isValidName) {
      return res.json({error: 'Only letters (a-z A-Z), numbers (0 - 9) or "_" allowed. Example: about.html'})
    } 
    if (!isValidfileType){
      return res.json({error: `"${fileType}" is not a valid page type.`});
    }
    if (fileType == 'content'){
      const isValidSlug = /^[a-z\-\d]+$/gi.test(urlslug); 
      if (!isValidSlug){
        return res.json({error: `"${urlslug}" is not a valid URL slug.`});
      }
    } else if(fileType == 'homepage'){
      // Homepage must have name set to index.html. Otherwise view for index page doesn't work.
      name = 'index.html';
    }

    let _templateToCopy = '';
    if (fileType == "content" || fileType == "homepage"){
      _templateToCopy = path.join(__dirname, '../templates/views/', '_default', 'index.html');
    } else if (fileType == "job-details") {
      _templateToCopy = path.join(__dirname, '../templates/views/', '_default', 'jobdetails.html');
    } else if (fileType == "search-results") {
      _templateToCopy = path.join(__dirname, '../templates/views/', '_default', 'searchresults.html');
    }

    const filepath = path.join(__dirname, '../templates/views/', status ,`${name}`);
    
    fs.copyFile(_templateToCopy, filepath, async (err) => {
      if (err) {
        res.json({error: 'Error creating file.'})
      } else {
        try{
          const createdUser = req.user.name;
          const newPage = await PageService.create({orgid, filepath, name, status, createdUser, fileType, urlslug});
          res.json({success: true, message: 'File created.'})
        } catch (error) {
          res.json({error});
        }
      }
    });

    // Update the copied file with the name of the theme to ensure the "extends" keyword workds for the templating engine

  }

  static async updatePageHtml(req, res){
    const orgid = req.user.orgid;
    try {
      // New content for file
      const newContent = req.body.newContent;
      // Id of file to be updated 
      const _id = new ObjectId(req.params.pageid);
      // Get file doc
      const fileDoc = await PageService.getOne({ _id });
      // Check file isn't locked by another user
      if (fileDoc.fileLocked && fileDoc.fileLockedBy !== req.user.name) {
        res.status(403).json({error: `File locked by ${fileDoc.fileLockedBy}.`});
      } else {
        // Update file in filesystem
        fs.writeFile(fileDoc.filepath, newContent, { encoding: 'utf-8', flag: 'w' }, (err) => {
          if (err) {
            res.json({erro: 'Error saving file.'})
          }
        });
        // Update template doc
        const updateFileDocProperties = { fileLocked: false, fileLockedBy: '', lastEdited: { timestamp: Date.now(), byUser: req.user.name } }
        const updated = await PageService.updateOne({ _id }, updateFileDocProperties);
        res.json({ success: true, message: 'File saved successfully.' })
      }
    } catch(error) {
      res.json({error});
    }
  }

  static async publishPage(req, res){
    const orgid = req.user.orgid;

    try {
      const publish = req.body.publish;
      const _id = new ObjectId(req.params.pageid);
      const fileDoc = await PageService.getOne({ _id });

      if (publish === 'preview') {
        // Move file from drafts to preview folder
        const newFilePath = path.join(__dirname, '../templates/views/preview/', fileDoc.name);
        fsX.move(fileDoc.filepath, newFilePath, (err) => {
          if (err) {
            return res.json({error: 'Error publishing file.'});
          }
        })
        // Update file doc in db
        const updated = await PageService.updateOne({ _id }, {
          filepath: newFilePath, status: publish, lastPublished: { timestamp : Date.now(), to: publish, byUser: req.user.name }
        })
        return res.json({success: true, message: 'File published successfully to preview.'})
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
  PagesController
}