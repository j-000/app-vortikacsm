// Create App
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const { logrequests } = require('./middlewares/serverlogging');
const mongoose = require('mongoose');


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/database1');
}


// Set templates folder
app.set('views', path.join(__dirname, 'templates'));


// Use to parse JSON requests
app.use(bodyParser.json())


// Set static folder
app.use(express.static('public'));


// [Must stay on top of app.js and before middleware below]
// Allow CORS 
app.use(cors({ origin: ['http://localhost:5173'] }));


// Cookie Parser
app.use(cookieParser());


// [Must stay on top of app.js] 
// Custom middleware for request logging - #DEVONLY
app.use((req, res, next) => logrequests(req, res, next))


// Import Routes
const { apiRoutes } = require('./routes/api');


// Use Routes
app.use('/api', apiRoutes);


// Start Server
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
})