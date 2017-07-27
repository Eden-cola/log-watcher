"use strict"

const WebSocketServer = require('./webSocketServer');
const LogWatcher = require('./logWatcher');
const LogServer = require('./logServer');
const _ = require('lodash');

const server = new WebSocketServer();
const watcher = new LogWatcher('c:/www/yiyashop/logs/');
const logServer = new LogServer(8081);
watcher.on('update', ({filename, data})=>{
  const logs = _(data).split("\n===\n").compact().map(function (log) {
    const [time, request, response] = _(log).split("\n", 3).compact().value();
    return {time, request, response};
  }).value();
  console.log(filename, logs);
  server.send({filename, logs});
});
logServer.on('update', ({filename, data})=>{
  const logs = _(data).split("\n===\n").compact().map(function (log) {
    const [time, request, response] = _(log).split("\n", 3).compact().value();
    return {time, request, response};
  }).value();
  console.log(filename, logs);
  server.send({filename, logs});
});
server.listen(8080);
