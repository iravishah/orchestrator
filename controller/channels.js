const _ = require('lodash');

const m = require('../responses/responses.json');

const { reply } = require('../lib/utils');

const { getMembers, sadd, removeMember, zrange, zincrby } = require('../db/redis_utils');

const config = global.config;

async function checkIfChannelExists(req, res, next) {
  const [err, data] = await getMembers(config.key);
  if (err || !data) {
    return reply(res, m102);
  }

  const channel = String(req.body.channel);

  if (data.length && data.indexOf(channel) !== -1) {
    return reply(res, m.m103);
  }

  req.channel = channel;

  next();
}

async function createChannel(req, res, next) {
  const [err, data] = await sadd(config.key, req.channel);
  if (err || !data) {
    return reply(res, m102);
  }
  next();
}

async function listenChannel(req, res, next) {
  global.subscriber.subscribe(req.channel);
  res.status(200).json({ result: 'success' });
}

async function removeChannel(req, res, next) {
  const channel = req.params.channel;

  const [err, data] = await removeMember(config.key, channel);
  if (err) {
    return reply(res, m102);
  }
  global.subscriber.unsubscribe(channel);
  if (data) {
    return res.status(200).json({ result: 'success' });
  }
  reply(res, m.m104);
}

module.exports = {
  checkIfChannelExists,
  createChannel,
  listenChannel,
  removeChannel
}