//@ts-check
"use strict";

const schema = require('validate');

module.exports = schema({
  channel: {
    type: 'string',
    required: true,
    message: 'channel is required'
  }
});