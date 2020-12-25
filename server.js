var express = require("express");
var app = express();
var fs = require("fs");
var morgan = require("morgan");
var winston = require("winston");
const isbot = require("isbot");
var path = require("path");
var _ = require("lodash");
var accessLogStream = fs.createWriteStream(__dirname + "/myLogFile.log", {
  flags: "a",
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});


// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", function (req, res) {
  console.log(req.get("user-agent"))
  if (
    isbot(req.get("user-agent")) ||
    _.includes(req.get("user-agent"), "Chrome-Lighthouse")
  ) {
    logger.log({
      level: 'info',
      message: `BOT - ${req.get("user-agent")}`
    });
    res.sendFile(path.resolve('real/index.html'));
  } else {
    logger.log({
      level: 'info',
      message: `PER - ${req.get("user-agent")}`
    });
    res.sendFile(path.resolve('fake/index.html'));
  }
});
app.set("port", process.env.PORT || 5555);
app.set("host", process.env.HOST || "localhost");

app.listen(app.get("port"), function () {
  console.log(
    "%s server listening at http://%s:%s",
    process.env.NODE_ENV,
    app.get("host"),
    app.get("port")
  );
});
