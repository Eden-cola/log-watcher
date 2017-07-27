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
        ws.filter = message;
      });
      ws.on('error', (err)=>{
        console.log(err);
        console.log(ws);
      })
      this.wsList.push(ws);
    });
  }

  send (data) {
    const apiname = data.filename.split('.')
      .shift().split('-').join('/');
    this.sendRow(JSON.stringify(data), apiname);
  }

  sendRow (message, apiname) {
    this.wsList = _.filter(this.wsList, function (ws) {
      if (ws.filter != '')
        if (apiname.indexOf(ws.filter) < 0)
          return true;
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

