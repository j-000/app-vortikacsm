// ExpressJs imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

// Import custom middleware
const { logrequests } = require('./middlewares/serverlogging');
const { setsubdomain } = require('./middlewares/routing');

// Import custom routes
const { apiRoutes } = require('./routes/api');
const { coreRoutes } = require('./routes/core');


// Create express.js app
const app = express();

// Load environment variables
require('dotenv').config()


// Connect to DB
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/database1');
}

// Set view engine to Nunjucks
app.set('view engine', 'njk');
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
});

// Set templates folder
app.set('views', path.join(__dirname, 'templates/'));

// Use bodyparser to parse JSON requests
app.use(bodyParser.json())

// Set static folder
app.use(express.static('public'));

// Allow CORS 
// [Must stay on top of app.js and before middleware below]
app.use(cors({ origin: ['http://localhost:5173'] }));

// Cookie Parser
app.use(cookieParser());

// [Must stay on top of app.js] 
// Custom middleware for request logging - #DEVONLY
app.use((req, res, next) => logrequests(req, res, next))

// Middleware to ensure corret stage (public/preview) is set.
app.use((req, res, next) => setsubdomain(req, res, next));

app.use('/', coreRoutes);
app.use('/api', apiRoutes);


// Start Server
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
})