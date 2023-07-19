// Create App
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const { logrequests } = require('./middlewares/serverlogging');
const nunjucks = require('nunjucks');


// View engine setup
app.set('view engine', 'njk');
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
});


// Set templates folder
app.set('views', path.join(__dirname, 'templates'));


// Use to parse JSON requests
app.use(bodyParser.json())


// Set static folder
app.use(express.static('public'));


// [Must stay on top of app.js and before middleware below]
// Allow CORS 
app.use(cors({ origin: ['*'] }));


// Cookie Parser
app.use(cookieParser());


// [Must stay on top of app.js] 
// Custom middleware for request logging - #DEVONLY
app.use((req, res, next) => logrequests(req, res, next))


// Import Routes
const { apiRoutes } = require('./routes/api');
const { pageRoutes } = require('./routes/pages');


// Use Routes
app.use('/api', apiRoutes);
app.use(pageRoutes);


// Start Server
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
})