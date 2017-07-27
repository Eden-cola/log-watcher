"use strict"

const WebSocket = require('ws');
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
      ws.on('message', (message) => {
        console.log('received: %s', message);
      });
      ws.on('error', (err)=>{
        console.log(err);
        console.log(ws);
      })
      this.wsList.push(ws);
    });
  }

  send (data) {
    this.sendRow(JSON.stringify(data));
  }

  sendRow (message) {
    this.wsList = _.filter(this.wsList, function (ws) {
      try {
        ws.send(message);
      } catch (e) {
        return false;
      }
      return true;
    });
  }
}

module.exports = WebSocketServer;

