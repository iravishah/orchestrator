const express = require('express');
const helmet = require('helmet');
const app = express();
const bodyParser = require('body-parser');

const loadConfig = require('./lib/config');
const Logger = require('./logger/logger');

config = global.config = loadConfig()
logger = global.logger = new Logger(config);

const routes = require('./routes/routes');
const Redis = require('./db/redis_connect');

const { startListener, reconnectChannels, startPollar } = require('./middleware/middleware');

app.use(helmet());
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(routes())

async function load() {
  await connectRedisDB();
  await connectPubsub();
  tryReconnect();
  start();
}

async function connectRedisDB() {
  const redis = new Redis(config.redis);
  global.redisConn = await redis.connect();
}

async function connectPubsub() {
  const pubsubConf = {
    host: config.redis.host,
    port: config.redis.port
  }
  const publisher = new Redis(pubsubConf);
  global.publisher = await publisher.connectPubsub();

  const subscriber = new Redis(pubsubConf);
  global.subscriber = await subscriber.connectPubsub();
  startListener();
  startPollar();
}

function tryReconnect() {
  reconnectChannels();
}

function start() {
  app.listen(config.port, () => logger.log(`api server started on port ${config.port}`));
}

load();