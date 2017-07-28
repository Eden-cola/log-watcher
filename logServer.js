"use strict"

const http = require('http');
const Koa = require('koa');
const _ = require('lodash');
const Events = require('events');

/**
 * Event:
 *  update: 有新数据
 */

class LogServer extends Events {
  constructor (port) {
    super();
    this.port = port;
    this.app = null;
    console.log('创建logServer');
    this.server = null;
    this.initServer();
  }

  initServer () {
    const app = new Koa();
    app.use((ctx) => {
      this.emit('update', ctx.request.query);
      ctx.body = 'success'
    });
    app.listen(this.port);
    this.app = app;
  }
}

module.exports = LogServer;

