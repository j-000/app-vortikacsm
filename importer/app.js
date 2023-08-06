
const express = require('express');
const cors = require('cors');
const { Queue } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const bodyParser = require('body-parser');
const { worker } = require('./workers/apiWorker');


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
// this is where the dashboard will be shown.
app.use('/admin', serverAdapter.getRouter());

app.get('/', async (req, res) => {
    const job = await jobsQ.add('Test', { orgid: '1', feedid: '2' }, {
        repeat: {
            cron: '44 * * * *',
        },
        removeOnComplete:{
            count: 100
        }
    })
    const job2 = await jobsQ.add('Test2', { orgid: '1', feedid: '2' }, {
        repeat: {
            cron: '44 * * * *',
        },
        removeOnComplete:{
            count: 100
        }
    })
    res.send({success: true, job1id: job.id, job2id: job2.id })
})

// Start Server
app.listen(3002, () => {
    console.log(`BullMQ Dashboard running on port 3002`);
})


// process.on("uncaughtException", function (err) {
//     // Handle the error safely
//     logger.error(err, "Uncaught exception");
//   });
  
// process.on("unhandledRejection", (reason, promise) => {
// // Handle the error safely
//     logger.error({ promise, reason }, "Unhandled Rejection at: Promise");
// });