const { wait } = require('../lib/utils');

async function getMembers(key) {
  return await wait(global.redisConn.smembers, global.redisConn, key);
}

async function sadd(key, value) {
  return await wait(global.redisConn.sadd, global.redisConn, key, value);
}

async function checkMemberExists(key, member) {
  return await wait(global.redisConn.sismembers, global.redisConn, key, member);
}

async function removeMember(key, member) {
  return await wait(global.redisConn.srem, global.redisConn, key, member);
}

async function zrange(hash) {
  return await wait(global.redisConn.zrange, global.redisConn, hash, 0, 0);
}

async function zincrby(hash, key) {
  return await wait(global.redisConn.zincrby, global.redisConn, hash, 1, key);
}

async function hdel(hash, key) {
  return await wait(global.redisConn.hdel, global.redisConn, hash, key);
}

async function zrem(hash, key) {
  return await wait(global.redisConn.zrem, global.redisConn, hash, key);
}

async function spop(key, value) {
  return await wait(global.redisConn.spop, global.redisConn, key, value);
}

module.exports = {
  getMembers,
  sadd,
  checkMemberExists,
  removeMember,
  zrange,
  zincrby,
  hdel,
  zrem,
  spop
}