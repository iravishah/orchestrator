module.exports = () => {
  const env = process.env.NODE_ENV || 'local';
  let config = require('./../env/' + env);
  config.environment = env;
  return config;
}