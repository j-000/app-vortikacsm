const xml2js = require('xml2js');
const JobsService = require('../database/services/jobs');
const { ObjectId } = require('mongodb');
const FeedsService = require('../database/services/feeds');

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

function apiXml(feed, orgid){
  const feedid = new ObjectId(feed._id);

  fetch(feed.url)
  .then(data => data.text())
  .then(xml => {
    xml2js.parseString(xml, async (err, result) => {
      if (err){
        console.log('Error importing', err);
      } else {
        // TODO: ensure this doesn't fail or raise an error
        // TODO: xml2js seems to convert the data to arrays key: ['value']. Need to convert this back to string.
        const jobs = findRootNode(feed.firstElementKey, result);

        if (jobs) {
          // delete all previously imported jobs from feed
          const result = await JobsService.removeMany({ feedid });          
        }

        try {
          // add jobs to jobscollection
          for (const job of jobs) {
            // TODO: validate all jobs contain same fields. (some jobs may be missing fields).
            // add new imported jobs
            const newJob = await JobsService.create(feedid, orgid, job);
          }
          const lastImport = Date.now();
          const feed = await FeedsService.update(feedid, { lastImport })

        } catch (error) {
          console.log('Error importing.');
        }
      }
    })
  });
}
function apiJson(){}
function sftpXml(){}
function sftpJson(){}


function importJobs(feed, orgid){
  if (feed.type == 'api' && feed.dataType == 'xml') {
    apiXml(feed, orgid);
  }


}


module.exports = {
  importJobs
}