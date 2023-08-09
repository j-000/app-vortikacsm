const { httpXML2Json, getAccessToken, httpDelete, httpGet, httpPost, findRootNode } = require('./globals');
require('dotenv').config()
const root_api_url = process.env.API_URL;


async function apiXml(job, feed, token){
  const { feedid, orgid } = job.data;

  try {
    const json = await httpXML2Json(feed.url);
    const jobs = findRootNode(feed.firstElementKey, json);

    if (jobs.length > 0) {
      job.log(`Found ${jobs.length} jobs in ATS data.`)
      let response;

      try {
        // Delete old jobs
        response = await httpDelete(`${root_api_url}/api/jobs/feed/${feedid}`, token);
        job.log('Deleted previously importer jobs.')
      } catch (error) {
        job.log(`Could not get feed from API. ${error.message}`);
        console.log(err);
        return
      } 
      
      if (response.success) {
        let json;
        try {
          // Get feed mappings object
          json = await httpGet(`${root_api_url}/api/mappings/feed/${feedid}`, token);
          job.log('Fetched feed mappings.')
        } catch (error) {
          job.log(`Could not get mappings from API. ${error.message}`);
          return
        }
        const feedMappings = json.mappings;
        let jobIteration = 0
        /**
         * 
         * Try catch but don't return inside the for loop to ensure
         * that jobs that would not fail, get processed.
         * 
         */
        let jobsProcessed = 0;
        for (const _job of jobs) {
          let context = {};

          // Update progress
          jobIteration += 1;
          job.updateProgress((jobIteration/jobs.length) * 100);
          job.log(`\tProcessing job ${jobIteration} of ${jobs.length}.`)

          // Complete the mappings (assign the value from the ATS job data to the 
          // respective props field on the context object) 
          Object.keys(feedMappings.props).forEach(jmp => {
            // jmp => (id, title, description, apply_url, array_one, etc.)
            try {
              const mappedField = feedMappings.props[jmp].mappedTo.sourceField;
              if(mappedField !== null) {
                context[jmp] = _job[mappedField]
              }  
            } catch (error) {
              job.log(`Could not map the field "${jmp}" to the job.`);
            }
            // TODO: implement function mappings
          });

          try {
            // Save the job to the database only if saveJob is true.
            const res = await httpPost(`${root_api_url}/api/jobs`, { feedid, orgid, props: context }, token);
            jobsProcessed += 1
          } catch (error) {
            job.log(`Could not save job ${jobIteration} via API. ${error.message}`);
            console.log(error);              
          }
        }
        job.log(`Jobs processed successfully: ${jobsProcessed} of ${jobs.length}.`)

        try {
          // Update last import field
          const lastImport = Date.now();
          await httpPost(`${root_api_url}/api/feeds/${feedid}?`, {lastImport}, token);
        } catch (error) {
          job.log(`Could not update "last_import" feed for feed ${feedid}. ${error.message}`);
          return
        }
      } else {
        job.log(`Response from /api/jobs/feed returned success:${response.success}.`);
      }

    } else {
      job.log('No jobs found in the ATS data.')
    } 
  } catch (error) {
    job.log(`General error: ${error.message}`)
    console.log(error)
  } 
}


async function importJobs(job){
  const token = await getAccessToken();
  const { feedid } = job.data;

  if (token) {
    const json = await httpGet(`${root_api_url}/api/feeds/${feedid}`, token);
    const feed = json.feed;
    if (feed.sourceFields.length > 0) {
      if (feed.type == 'api' && feed.dataType == 'xml') {
        await apiXml(job, feed, token);
      }
    } else {
      // Get source fields first. 
      // Don't run import until mappings complete.
      try {
        const json = await httpXML2Json(feed.url);
        const jobs = findRootNode(feed.firstElementKey, json);
        const jobFields = Object.keys(jobs[0]);
        await httpPost(`${root_api_url}/api/feeds/${feedid}`, { sourceFields: jobFields }, token);
      } catch (error) {
        job.log(error)
        console.log(error)
      }
    } 
  } else {
    job.log('Could not obtain access token.')
  }
}


module.exports = {
  importJobs
}