const { Worker } = require('bullmq');
const { importJobs } = require('./general');

// Load env vars
require('dotenv').config()

// Get queue name
const queueName = process.env.QUEUE_NAME;

// Setup config
const config = { 
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
}

// Create workers
const vor = new Worker(queueName, async (job) => { importJobs(job) }, config);
const tika = new Worker(queueName, async (job) => { importJobs(job) }, config);

// Listen to error
const workers = [vor, tika];
workers.forEach(w => {
  w.on('error', err => { console.log(`${w.name} - Error: ${err}`) })
})


module.exports = {
  workers
}