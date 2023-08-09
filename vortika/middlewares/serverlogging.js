const chalk = require("chalk");

function logrequests(req, res, next) {
    const { method, url } = req;
    let userAgent = req.headers['user-agent'];
    if (userAgent.length > 10) {
      userAgent = userAgent.slice(0, 10);
    }
    res.on('finish', () => {
      const { statusCode } = res;
      const statusColor =
        statusCode >= 500
          ? chalk.red(`${statusCode} - ${method}`)
          : statusCode >= 400
            ? chalk.yellow(`${statusCode} - ${method}`)
            : chalk.green(`${statusCode} - ${method}`);
      const s = `${chalk.gray(new Date().toLocaleTimeString())} - [${userAgent}] -${statusColor} - ${chalk.blueBright(url)}`;
      console.log(s);
    })
    req.on('data', () => {
      console.log(`${chalk.red('DATA')}`)
    })
    req.on('aborter', () => {
      console.log(`${chalk.red('ERROR')}`)
    })
    req.on('error', (err) => {
      console.log(`${chalk.red('ERROR')} - ${err.message}`)
    })
    next();
} 

module.exports = {
    logrequests
}