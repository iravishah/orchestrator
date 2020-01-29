const mongoose = require('mongoose');

function load() {
  require('./../index');

  //require all test files

  describe('mockgoose connection', () => {
    const Mockgoose = require('mockgoose-fix').Mockgoose;
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.helper.setDbVersion('3.2.20');
    return mockgoose.prepareStorage().then(function () {
      return mongoose.connect('mongodb://foobar/baz')
    })
      .then((done) => {
        return mongoose.createConnection('mongodb://foobar/baz');
      })
  })

  require('./rooms.test');
}

module.exports = {
  load
}