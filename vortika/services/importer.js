const xml2js = require('xml2js');
const JobsService = require('../database/services/jobs');
const { ObjectId } = require('mongodb');
const FeedsService = require('../database/services/feeds');
const MappingService = require('../database/services/mappings');

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

  console.log(`Starting import for: feed-${feed._id} (${feed.url}) orgid-${orgid}`);
  // feed is the feed doc.
  const feedid = feed._id;

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
          console.log(`Found root jobs array in XML. Found ${jobs.length} jobs.`)
          // if new api call has jobs (whether new or not)
          // delete all previously imported jobs from jobs collection
          const result = await JobsService.removeMany({ feedid });          
        }

        try {
          // Get mapping props for feed id.
          const feedMappings = await MappingService.getOne({ feedid });

          // add jobs to jobscollection
          for (const job of jobs) {
            // TODO: validate all jobs contain same fields. (some jobs may be missing fields).
            // add new imported jobs
            let context = {};
            // convert the jobs props
            // to a context object based on the mappings fields.
            console.log(`Adding context props to job object.`);
            
            Object.keys(feedMappings.props).forEach(jmp => {
              // jmp => (id, title, description, apply_url, array_one, etc.)
              const mappedField = feedMappings.props[jmp].mappedTo.sourceField;
              
              // TODO: implement function mappings
              if(mappedField !== null) {
                console.log(`Mapping ${jmp} to ${mappedField}`);
                context[jmp] = job[mappedField]
              }
            });
            
            const props = context;
            const newJob = await JobsService.create(feedid, orgid, props);
          }
          const lastImport = Date.now();
          console.log(`Updating feed last import timestamp.`);
          const feed = await FeedsService.update(feedid, { lastImport })
        } catch (error) {
          console.log(error);
          console.log('Error importing.');
        }
      }
    })
  });
}
function apiJson(){}
function sftpXml(){}
function sftpJson(){}


async function importJobs(feedid, orgid){
  const _id = new ObjectId(feedid);
  const feed = await FeedsService.getOne({ _id });
  if (feed.type == 'api' && feed.dataType == 'xml') {
    apiXml(feed, orgid);
  }
}


module.exports = {
  importJobs
}