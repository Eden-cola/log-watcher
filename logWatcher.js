"use strict"

const fs = require('fs');
const _ = require('lodash');
const Events = require('events');

/**
 * Event:
 *  update: 有新数据
 *  change: 文件发生了变动
 */

class LogWatcher extends Events {
  constructor (path) {
    super();
    this.path = path;
    this.fileList = {};
    console.log('初始化目录');
    this.initFileList();
    this.watcher = null;
    this.initWatcher();
    this.updateQueue = [];
    this.on('change', _.debounce(()=>{
      this.processUpdateQueue();
    }, 500));
  }

  //初始化file size
  initFileList () {
    fs.readdir(this.path, (err, files) => {
      files.forEach((item)=>{
        if (!(new RegExp('.+(\.log)$')).test(item))  
          return ;
        if (this.fileList[item]) 
          return ;
        console.log('初始化文件'+item);
        fs.stat(this.path+item, (err, state)=>{
          this.fileList[item] = state.size;
        })
      });
    })
  }

  initWatcher () {
    this.watcher = fs.watch(this.path);
    this.watcher.on('change', (eventType, filename) => {
      if (eventType == 'rename') return this.initFileList();
      if (!filename || eventType != 'change') return ;
      if (!this.fileList[filename]) return ;
      this.updateQueue.push(filename);
      this.emit('change');
    })
  }

  processUpdateQueue () {
    _.each(_.uniq(this.updateQueue), (filename) => {
      fs.stat(this.path+filename, (err, state)=>{
        if (err) {
          console.log(err);
          return ;
        }
        if (state.size > this.fileList[filename]) {
          this.getNewData(filename);
        }
        this.fileList[filename] = state.size;
      })
    })
    this.updateQueue = [];
  }

  getNewData (filename) {
    const readStream = fs.createReadStream(this.path+filename, {
      start: this.fileList[filename]
    });
    const chunks = [];
    readStream.on('data', (chunk)=>{
      chunks.push(chunk);
    })
    readStream.on('end', ()=>{
      const data = Buffer.concat(chunks).toString();
      this.emit('update', { filename, data });
    })
  }
}

module.exports = LogWatcher;

