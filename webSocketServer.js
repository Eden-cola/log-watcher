"use strict"

const WebSocket = require('ws');
const WebSocketLink = require('./webSocketLink');
const _ = require('lodash');
const Events = require('events')

class WebSocketServer extends Events {
  constructor () {
    super();
    this.wsList = [];
  }

  listen (port) {
    this.wss = new WebSocket.Server({port});
    this.wss.on('connection', (ws) => {
      this.wsList.push(new WebSocketLink(ws));
    });
  }

  send (data) {
    this.wsList = _.filter(this.wsList, function (ws) {
      return ws.send(data);
    });
  }
}

module.exports = WebSocketServer;

