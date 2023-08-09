
const express = require('express');
const cors = require('cors');
const { Queue } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const bodyParser = require('body-parser');
const { workers } = require('./workers/apiWorker');

require('dotenv').config()

// Create Express app
const app = express();

// Use bodyparser to parse JSON requests
app.use(bodyParser.json())

// Allow CORS 
app.use(cors({ origin: ['*'] }));

// Create a Queue
const jobsQ = new Queue(process.env.QUEUE_NAME, { connection : {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}})

// Create an Adapter 
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/'); 

// Configure UI Dashboard
createBullBoard({
  queues: [new BullMQAdapter(jobsQ)],
  serverAdapter: serverAdapter,
});

// Configure routes for dashboard
app.use('/', serverAdapter.getRouter());

// Start Server
app.listen(3002, () => {
    console.log(`BullMQ Dashboard running on port 3002`);
})

