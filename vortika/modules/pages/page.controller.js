const { ObjectId } = require('mongodb');
const fs = require('fs');
const fsX = require('fs-extra');
const path = require('path');
const PageService = require('./page.service');



class PagesController {

  static async getPages(req, res){
    const orgid = req.user.orgid;
    
    let status = req.query.status.toLowerCase(); 
    const isValidStatus = ['draft', 'preview', 'live'].includes(status);

    if (!isValidStatus){
      res.json({error: 'Not valid ?type= parameter.'})
    } else {
      try {
        if (status == 'live') status = 'public';
        let filter = { status, fileType: {$not : {$regex: 'theme'} }};
        const pages = await PageService.getMany(filter, {__v: 0, filepath: 0});
        res.json({ pages });
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
    let { fileType, urlslug, name, themeId } = req.body;

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

    const TEMPLATES_ROOT = req.app.get('TEMPLATES_ROOT');
    let _templateToCopy = '';
    if (fileType == "content" || fileType == "homepage"){
      _templateToCopy = path.join(TEMPLATES_ROOT, '_default', 'index.html');
    } else if (fileType == "job-details") {
      _templateToCopy = path.join(TEMPLATES_ROOT, '_default', 'jobdetails.html');
    } else if (fileType == "search-results") {
      _templateToCopy = path.join(TEMPLATES_ROOT, '_default', 'searchresults.html');
    }
    const filepath = path.join(TEMPLATES_ROOT, status ,`${name}`);
    const _id = new ObjectId(themeId);
    const theme = await PageService.getOne({ _id });

    try {
      fs.copyFileSync(_templateToCopy, filepath);
      const createdUser = req.user.name;
      const newPage = await PageService.create({orgid, filepath, name, status, createdUser, fileType, urlslug});
    } catch (error){
      res.json({error: 'Error creating page.'})
    }

    try {
      const contents = fs.readFileSync(filepath, 'utf-8');
      const updatedContent = contents.replace("theme.html", theme.name);
      fs.writeFileSync(filepath, updatedContent, 'utf-8');
    } catch (error) {
      res.json({error: 'Error updating reference to "extends".'})
    }

    res.json({success: true, message: 'Page created.'});

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
    const TEMPLATES_ROOT = req.app.get('TEMPLATES_ROOT');

    try {
      const publish = req.body.publish;
      const _id = new ObjectId(req.params.pageid);
      const fileDoc = await PageService.getOne({ _id });

      if (publish === 'preview') {
        // Move file from drafts to preview folder

        const newFilePath = path.join(TEMPLATES_ROOT, '/preview/', fileDoc.name);
        
        if (fileDoc.filepath === newFilePath) {
          res.json({error: 'This file is already published to preview. If you made changes, simply press "save".'});
          return
        }
        
        try {
          fsX.moveSync(fileDoc.filepath, newFilePath)
        } catch (err) {
          res.json({error: 'Error publishing file.'});
          return
        }

        // Update file doc in db
        const updated = await PageService.updateOne({ _id }, {
          filepath: newFilePath, status: publish, lastPublished: { timestamp : Date.now(), to: publish, byUser: req.user.name }
        })
        return res.json({success: true, message: 'File published successfully to preview.'});
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