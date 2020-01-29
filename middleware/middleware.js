const { getMembers, sadd, spop } = require('../db/redis_utils');

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

    if(typeof message === 'object') {
      message = JSON.stringify(message);
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
      callback(message[0]);
    }
  }, 1000);
}

async function callback(message) {
  global.publisher.publish(config.dbWriterChannel, message);
}

module.exports = {
  reconnectChannels,
  startListener,
  startPollar
}