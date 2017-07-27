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
    this.port = port;
    super();
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
    this.server = http.createServer(app).listen(this.port);
  }

module.exports = LogServer;

