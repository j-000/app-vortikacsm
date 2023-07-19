const chalk = require("chalk");

function logrequests(req, res, next) {
    const { method, url } = req;
    res.on('finish', () => {
      const { statusCode } = res;
      const statusColor =
        statusCode >= 500
          ? chalk.red(`${statusCode} - ${method}`)
          : statusCode >= 400
            ? chalk.yellow(`${statusCode} - ${method}`)
            : chalk.green(`${statusCode} - ${method}`);
      const s = `${chalk.gray(new Date().toLocaleTimeString())} - ${statusColor} - ${chalk.blueBright(url)}`;
      console.log(s);
    });
    next();
} 

module.exports = {
    logrequests
}