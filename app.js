// Create App
const express = require('express');
const app = express();
const chalk = require('chalk');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');



// View engine setup
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'templates'));


// Set static folder
app.use(express.static('public'));


// [Must stay on top of app.js and before middleware below]
// Allow CORS 
app.use(cors({origin: ['*']}));


// Cookie Parser
app.use(cookieParser());


// [Must stay on top of app.js] 
// Custom middleware for request logging - #DEVONLY
app.use((req, res, next) => {
    const { method, url } = req;
    res.on('finish', () => {
        const { statusCode } = res;
        const statusColor =
        statusCode >= 500
            ? chalk.red(`${statusCode} - ${method}`)
            : statusCode >= 400
            ? chalk.yellow(`${statusCode} - ${method}`)
            : chalk.green(`${statusCode} - ${method}`);
        const s = `${ chalk.gray(new Date().toLocaleTimeString()) } - ${ statusColor } - ${ chalk.blueBright(url) }`;
        console.log(s);
    });
    next();
})


// Import Routes


// Use Routes
app.get('/', (req, res) => {
    res.status(200).render('index.html')
})


// Start Server
app.listen(3001, () => {
    console.log(`Server running on port 3001`);
})