
const express = require('express');
const cors = require('cors');
const { Queue, Worker } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
// Use bodyparser to parse JSON requests
app.use(bodyParser.json())
// Allow CORS 
app.use(cors({ origin: ['*'] }));
// Create a Queue
const jobsQ = new Queue('Imports', { connection : {
  host: 'localhost',
  port: 6379
}})
// Create an Adapter 
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin');
// Configure UI Dashboard
createBullBoard({
  queues: [new BullMQAdapter(jobsQ)],
  serverAdapter: serverAdapter,
});
// Configure routes for dashboard
app.use('/admin', serverAdapter.getRouter());
// Setup worker
const worker = new Worker('Imports', async job => {
    for(let i = 0; i < 100; i++){
        job.updateProgress(i);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log(job.data);
})
// Event Listeners
worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});   
worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});

// Start Server
app.listen(3002, () => {
    console.log(`BullMQ Dashboard running on port 3002`);
})