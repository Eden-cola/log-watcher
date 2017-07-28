"use strict"

const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
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
    app.use(bodyParser());
    app.use((ctx) => {
      //console.log(ctx.request.body);
      this.emit('update', ctx.request.body);
      ctx.body = 'success'
    });
    app.listen(this.port);
    this.app = app;
  }
}

module.exports = LogServer;

