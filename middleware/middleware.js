const { getMembers, zrange, zincrby, sadd, spop } = require('../db/redis_utils');

const config = global.config;

async function reconnectChannels() {
  const [err, data] = await getMembers(config.key);
  if (data && data.length) {
    data.forEach((channel) => {
      global.subscriber.subscribe(channel);
    });
  }
}

async function startListener() {
  global.subscriber.on('message', async (channel, message) => {
    if (!message) {
      return;
    }

    sadd(config.uniqueMessage, message);
  });
}

async function startPollar() {

  setInterval(async () => {
    const [e, message] = await spop(config.uniqueMessage, 1);
    if (e) {
      return e;
    }
    if (message && message.length) {
      callback(message);
    }
  }, 1000);
}

async function callback(message) {
  if (typeof message === 'string') {
    try {
      message = JSON.parse(message);
    } catch (e) { };
  }
  let [err, instanceId] = await zrange(config.intHash);
  if (err) {
    return;
  }

  instanceId = instanceId[0];

  zincrby(config.intHash, instanceId);

  const msg = {
    instanceId,
    data: message
  }
  global.publisher.publish(config.dbWriterChannel, JSON.stringify(msg));
}

module.exports = {
  reconnectChannels,
  startListener,
  startPollar
}