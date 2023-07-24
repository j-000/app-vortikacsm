const xml2js = require('xml2js');
const { MongoDB } = require('../database/mongo');
const { ObjectId } = require('mongodb');


function findRootNode(key, obj){
  for (const k in obj){
    if (k === key){
      return obj[key];
    }
    if (typeof obj[k] === 'object' && obj[k] !== null){
      const nestedResult = findRootNode(key, obj[k]);
      if (nestedResult !== undefined){
        return nestedResult
      }
    }
  }
  return undefined
}


function importJobs(feed, orgid){
  if (feed.type == 'api') {
    fetch(feed.url)
    .then(data => data.text())
    .then(xml => {
      xml2js.parseString(xml, async (err, result) => {
        if (err){
          console.log('Error importing', err);
        } else {
          const jobs = findRootNode(feed.firstElementKey, result);
          try {
            const db = await MongoDB.getdb();
            const _id = new ObjectId(feed._id);
            const lastImport = Date.now();
            // for each job add orgid and feedkey
            const updatedJobs = jobs.map((job) => ({ ...job, feedid: feed._id, orgid }))
            // add jobs to jobscollection
            const jobsCollection = db.collection('jobs');
            const g = await jobsCollection.insertMany(updatedJobs);
            // update feed lastImport
            const feedsCollection = db.collection('feeds');
            const f = await feedsCollection.findOneAndUpdate({ _id }, {$set : { lastImport }});
          } catch (error) {
            console.log('Error importing.');
          }
        }
      })
    });
  }
}


module.exports = {
  importJobs
}