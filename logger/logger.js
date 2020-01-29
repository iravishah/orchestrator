//@ts-check
"use strict";

const winston = require('winston');
const fs = require('fs-extra');
const uuid = require('uuid');

module.exports = class Logger {

  constructor(config) {
    fs.ensureFileSync(config.logFile)
    winston.add(new winston.transports.File({
      filename: config.logFile,
      maxFiles: 20,
      maxsize: 1000000,
      tailable: true,
      json: true
    }));
    if (config.environment === 'local') {
      winston.add(new winston.transports.Console())
    }
  }
  stringify(obj) {
    if (obj && obj.stack) {
      return obj.stack
    } else if (typeof (obj) !== 'string') {
      return JSON.stringify(obj)
    }
    return obj
  }

  info(msg, meta) {
    if (process.env.LOGOFF) {
      return meta;
    }
    if (!meta || !meta.uid) {
      meta = meta || {};
      meta.uid = uuid.v1();
    }
    winston.info(this.stringify(msg), meta);
    return meta;
  }

  log(msg, meta) {
    if (process.env.LOGOFF) {
      return meta;
    }
    if (!meta || !meta.uid) {
      meta = meta || {};
      meta.uid = uuid.v1();
    }
    winston.info(this.stringify(msg), meta);
    return meta;
  }

  warn(msg, meta) {
    if (process.env.LOGOFF) {
      return meta;
    }
    if (!meta || !meta.uid) {
      meta = meta || {};
      meta.uid = uuid.v1();
    }
    winston.warn(this.stringify(msg), meta);
    return meta;
  }

  error(msg, meta) {
    if (process.env.LOGOFF) {
      return meta;
    }
    if (!meta || !meta.uid) {
      meta = meta || {};
      meta.uid = uuid.v1();
    }
    winston.error(this.stringify(msg), meta);
    return meta;
  }

  debug(msg, meta) {
    if (process.env.LOGOFF) {
      return meta;
    }
    if (!meta || !meta.uid) {
      meta = meta || {};
      meta.uid = uuid.v1();
    }
    winston.debug(this.stringify(msg), meta);
    return meta;
  }
}