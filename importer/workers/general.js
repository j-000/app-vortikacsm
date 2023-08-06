const xml2js = require('xml2js');

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


async function httpRequest(url) {
  try {
    const data = await fetch(url);
    const text = await data.text();
    const json = await xml2js.parseStringPromise(text);
    return json
  } catch (error) {
    throw error
  }
}

const root_api_url = 'http://localhost:3001';


async function apiXml(job, feed, token){

  const { feedid, orgid } = job.data;
  try {
    const json = await httpRequest(feed.url);
    const jobs = findRootNode(feed.firstElementKey, json);
    
    if (jobs) {
      job.log(` Found ${jobs.length} jobs.`);

      try {
        // delete all previously imported jobs from jobs collection
        const result = await fetch(`${root_api_url}/api/jobs/feed/${feedid}?__ua=importer-delete_jobs`, { method: 'delete', 
          headers: {authorization: `Bearer ${token}`} });
        const json = await result.json();
      } catch (err) {
        throw err
      } 
      job.log(` Deleting this feed's old jobs from database.`);
      if (json.success) {
        try {
          job.log(` Getting the mappings for this feed.`);
          // Get mapping props for feed id.
          const response = await fetch(`${root_api_url}/api/mappings/feed/${feedid}?__ua=importer-get_mappings`, {
            headers: {authorization: `Bearer ${token}`}
          });
          const json = await response.json();
          const feedMappings = json.mappings;
          job.log(` Looping through ${jobs.length} jobs.`);
          // add jobs to jobscollection
          // jobs = [{}, {}, ... ]
          let _c = 0;
          job.log(` Adding context props to job object.`);

          // let newJobs = [];
          // let i = 0
          // for (const _job of jobs) {
          //   i += 1;
          //   job.updateProgress((i/jobs.length) * 100);
          //   // TODO: validate all jobs contain same fields. (some jobs may be missing fields).
          //   // add new imported jobs
          //   let context = {};
          //   // convert the jobs props
          //   // to a context object based on the mappings fields.            
          //   // Not required. Only for logging.
          //   Object.keys(feedMappings.props).forEach(jmp => {
          //     // jmp => (id, title, description, apply_url, array_one, etc.)
          //     const mappedField = feedMappings.props[jmp].mappedTo.sourceField;
              
          //     // TODO: implement function mappings
          //     if(mappedField !== null) {
          //       // Not required - this is only for logging purposes.
          //       if (_c < 1) {
          //         job.log(`\t Mapping "${jmp}" to "${mappedField}"`);
          //       }
          //       context[jmp] = _job[mappedField]
          //     }
          //   });
          //   _c += 1;

          //   job.log(` Adding all jobs to the database...`);
          //   jobObj = { feedid, orgid, props: context };


          //   // const response = await fetch(`${root_api_url}/api/jobs?MAMAGUEVO`, {
          //   //   method: 'post',
          //   //   headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
          //   //   body: JSON.stringify({ jobObj })
          //   // })
          //   // if (!response.ok) {
          //   //   throw new Error(`Failed to add job to the database: ${response.status} - ${response.statusText}`);
          //   // }

          // }
          const lastImport = Date.now();
          job.log(` Updating feed last import timestamp...`);
          await fetch(`${root_api_url}/api/feeds/${feedid}?__ua=importer-update_timestamps`, {
            method: 'post',
            headers: { authorization:  `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({ lastImport })
          });
          job.log(` Job done! `); 
          
        } catch (error) {
          job.log(error);
          console.log(error);
          job.log('Error importing.');
        }
          
      } else {
        console.log(json);
        job.log(` Oh no. I wasn't able to delete the old jobs. Exiting.`);
      }
    } else {
      job.log(` I didn't find any jobs. Can you check the source API/SFTP?`);
    } 
  } catch (error) {
    job.log(error);
  } 
}



async function importJobs(job){
  const { feedid } = job.data;
  
  const login = await fetch(`${root_api_url}/api/login?__ua=importer-login`, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: 'j@j.com',
      password: '123'
    })
  })
  const json = await login.json();
  const token = json.token;
  if (token) {
    job.log(`^... `)
    const response = await fetch(`${root_api_url}/api/feeds/${feedid}?__ua=importer-get_feed`, { headers: { authorization: `Bearer ${token}`}});
    const json = await response.json();
    const feed = json.feed;
    // Check if source fields has been added to the feed.
    job.log(' Checking mappings have been completed for this feed...')
    if (feed.sourceFields.length > 0) {
      job.log(`^... `)
      job.log(' Checking feed type... ')
      if (feed.type == 'api' && feed.dataType == 'xml') {
        job.log(`^... `)
        job.log(` Looks like an API/XML type of import. Let's do this!`)
        apiXml(job, feed, token);
      } else {
        // TODO: implement
      }
    } else {
      job.log(` Oh... You must complete the mappings for feedid #${feedid} first.`)
      // Get source fields first. Don't run import until mappings complete.
      try {
        job.log(` Let me fetch the source fields from a job currently in the source (API/SFTP)...`)
        const json = await httpRequest(feed.url);
        const jobs = findRootNode(feed.firstElementKey, json);
        const jobFields = Object.keys(jobs[0]);
        job.log(` Hard work! I found ${jobFields.length} source fields for you to reference in the feed mappings.`)
        job.log(`Let me add these to the database...`)
        
        await fetch(`${root_api_url}/api/feeds/${feedid}?__ua=vortikaimporter`, {
          method: 'post',
          headers: { authorization:  `Bearer ${token}`, 'Content-Type': 'application/json'},
          body: JSON.stringify({ sourceFields: jobFields })
        });

        job.log(` I am aborting this until you complete the mappings for this feed.`)
      } catch (error) {
        job.log(` I crashed. This is embarrassing and I don't know why... literally. [HTTP 500]`)
        job.log(error)
      }
    } 
  }

}


module.exports = {
  importJobs
}