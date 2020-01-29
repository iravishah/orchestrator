const { createClient } = require('redis');
const { wait } = require('../lib/utils');

class Redis {

  constructor(options = {}) {
    this.options = options;
    this.conn = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.conn) {
        return resolve(this.conn);
      }
      console.log(`Connecting to redis host: ${this.options.host} db: ${this.options.db}`);
      this.conn = createClient(this.options);

      this.conn.on('end', () => {
        console.log('Redis is disconnected');
      });

      this.conn.on('error', err => {
        console.log(`Error in redis connection ${err}`);
        reject(err);
      });

      this.conn.on('ready', async () => {
        if (!isNaN(this.options.db)) {
          const [err, ok] = await wait(this.conn.select, this.conn, Number(this.options.db));
          if (err) {
            console.log('Redis is not connected');
            reject(err);
          }
          if (ok) {
            console.log('redis connected!');
            return resolve(this.conn);
          }
        }
        console.log(`Invalid db value ${this.options.db}`);
        reject(`Invalid db value ${this.options.db}`);
      });
    });
  }


  connectPubsub() {
    return new Promise((resolve, reject) => {
      console.log(`Connecting to redis host: ${this.options.host}`);
      this.conn = createClient(this.options);

      this.conn.on('end', () => {
        console.log('Redis is disconnected');
      });

      this.conn.on('error', err => {
        console.log(`Error in redis create connection ${err}`);
        reject(err);
      });
      this.conn.on('ready', async () => {
        console.log('connected redis pub/sub');
        return resolve(this.conn);
      });
    });
  }

  disconnect() {
    this.conn.quit();
  }
}

module.exports = Redis;