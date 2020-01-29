const config = global.config;

const { hdel, zrem } = require('../db/redis_utils');
const { wait } = require('../lib/utils');

function checkPulse() {
  setInterval(async () => {
    let [err, data] = await wait(global.redisConn.hgetall, global.redisConn, config.hbHash);
    if (err) {
      logger.log('Error in fetching instances ', err);
      return;
    }
    if (!data) {
      return;
    }
    const instanceIds = Object.keys(data);
    instanceIds.forEach(hash => {
      try { data[hash] = JSON.parse(data[hash]); } catch (e) { }
    });

    instanceIds.forEach(async (hash) => {
      const time = data[hash];
      if (Date.now() - time >= config.cron.deadInterval) {
        hdel(config.hbHash, hash);
        zrem(config.intHash, hash);
      }
      return true;
    });
  }, config.cron.interval);
}

module.exports = {
  checkPulse
}