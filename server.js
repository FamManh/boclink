var express = require("express");
var app = express();
var fs = require("fs");
var morgan = require("morgan");
const isbot = require("isbot");
var path = require("path");
var _ = require("lodash");
var accessLogStream = fs.createWriteStream(__dirname + "/myLogFile.log", {
  flags: "a",
});

let log = (data)=>{
  fs.createWriteStream(__dirname + "/history.log", data)
}
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", function (req, res) {
  console.log(req.get("user-agent"))
  if (
    isbot(req.get("user-agent")) ||
    _.includes(req.get("user-agent"), "Chrome-Lighthouse")
  ) {
    log("NOT - "+ req.get("user-agent"))
    res.sendFile(path.resolve('real/index.html'));
  } else {
    log("BOT - "+ req.get("user-agent"))
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
