"use strict"

const Events = require('events')

class WebSocketLink extends Events {
  constructor (ws) {
    super();
    this.ws = ws;
    this.filter = '';
    this.closed = false;
    ws.on('message', (message) => {
      this.filter = message;
    });
    ws.on('close', (err)=>{
      this.closed = true;
    });
  }

  check (filename) {
    const apiname = filename.split('.').shift().split('-').join('/');
    if (this.filter != '')
      if (apiname.indexOf(this.filter) < 0)
        return false;
    return true;
  }

  setFilter (filter) {
    this.filter = filter;
  }

  send (data) {
    if (this.closed)
      return false;
    if (this.check(data.filename))
      return this.sendRow(JSON.stringify(data));
    return true;
  }

  sendRow (message) {
    try {
      this.ws.send(message);
    } catch (e) {
      return false;
    }
    return true;
  }
}

module.exports = WebSocketServer;

