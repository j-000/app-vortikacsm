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
main().catch(err => {console.log(err);});
async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
}

// Set view engine to Nunjucks
app.set('view engine', 'njk');
nunjucks.configure('templates/views', { autoescape: true, express: app , globals: { staticUrl: '/templates/assets' } });


// Use bodyparser to parse JSON requests
app.use(bodyParser.json())

// Set static folder
app.use(express.static(path.resolve(__dirname, 'templates/assets')));

// Allow CORS 
// [Must stay on top of app.js and before middleware below]
app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS }));

// Cookie Parser
app.use(cookieParser());

// [Must stay on top of app.js] 
// Custom middleware for request logging - #DEVONLY
app.use((req, res, next) => logrequests(req, res, next))

// Middleware to ensure corret stage (public/preview) is set.
app.use((req, res, next) => setsubdomain(req, res, next));

// Core routes
app.use('/', coreRoutes);

// Set default content type for api responses
app.use((req, res, next) => { res.header({'Content-Type': 'application/json'}); next(); })
// Api routes
app.use('/api', apiRoutes);

// Start Server
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
})