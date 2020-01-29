//@ts-check
"use strict"

module.exports = () => {
  const express = require('express');
  const router = express.Router();

  const utility = require('../lib/utils');

  const channel = require('../controller/channels');
  const channelPostBody = require('../validators/channelPostBody');


  router.get('/ping',
    utility.ping
  );

  router.post('/api/v1/start-listening',
    utility.authenicate,
    utility.validateBody(channelPostBody),
    channel.checkIfChannelExists,
    channel.createChannel,
    channel.listenChannel
  );

  router.delete('/api/v1/stop-listening/:channel',
    utility.authenicate,
    channel.removeChannel
  );

  router.all('*', (req, res) => {
    res.status(401).json({ error: 'Unauthorised access', code: 401 });
  });

  return router;
}
