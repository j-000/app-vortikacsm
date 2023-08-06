const { Worker } = require('bullmq');
const { importJobs } = require('./general');

// Setup workers
// Default is to have 2 worker (Vor, Tika)
const queueName = 'Imports';
const config = { 
  connection: {
    host: 'localhost',
    port: 6379
  }
}

const vor = new Worker(queueName, async (job) => {
  importJobs(job)
}, config);

vor.on('error', err => {
  // log the error
  console.error(err);
});

// Event Listeners
vor.on('completed', job => {
});   
vor.on('failed', (job, err) => {
});

const worker = vor

module.exports = {
  worker
}