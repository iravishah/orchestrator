
const util = require('util');

const m = require('../responses/responses.json');

const config = global.config;
/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function ping(req, res, next) {
  reply(res, m.m200);
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function authenicate(req, res, next) {
  const adminKey = req.headers.adminKey || req.headers.admin_key;

  if (adminKey !== config.adminKey) {
    logger.info(`error while matching admin key :: ${adminKey}`);
    return reply(res, m.m101);
  }
  next();
}
/**
 *
 *
 * @param {*} res
 * @param {*} message
 * @returns
 */
function reply(res, message) {
  return res.status(message.status).json(message.response);
}
/**
 *
 *
 * @param {*} func
 * @param {*} context
 * @param {*} args
 * @returns
 */
function wait(func, context, ...args) {
  if (func && typeof (func.then) === 'function') {
    return func.apply(context, args).then(data => {
      return [null, data];
    })
      .catch(err => [err]);
  } else if (typeof (func) === 'function') {
    func = util.promisify(func);
    return func.apply(context, args).then(data => {
      return [null, data];
    })
      .catch(err => [err]);
  } else {
    throw Error('only function and promise is allowed to apply on wait');
  }
}
/**
 *
 *
 * @param {*} func
 * @returns
 */
function validateBody(schema) {
  return (req, res, next) => {
    let errors = schema.validate(req.body, {
      strip: false
    });
    if (errors && errors.length) {
      return res.status(412).json({
        error: `${errors[0].message} in root.${errors[0].path}`,
        code: 100
      })
    }
    next();
  }
}


module.exports = {
  ping,
  authenicate,
  reply,
  wait,
  validateBody
}