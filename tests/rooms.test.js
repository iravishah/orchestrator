const should = require('should');
const request = require('request');

const URL = 'http://localhost:8080';
const ADMIN_KEY = 'test';

const mongoose = require('mongoose');

require('../models/rooms');
const Rooms = mongoose.model('Rooms');

describe('Rooms Testsuit', () => {
  describe('Create Room Booking testsuite', () => {
    before((done) => {
      Rooms.create({
        "title": "Deluxe Rooms",
        "type": "deluxe_rooms",
        "price": 7000.0,
        "qty": 1,
        "features": [
          "Queen Size Bed"
        ]
      }, (e, r, d) => {
        done();
      })
    });

    after((done) => {
      Rooms.remove({}, (e, r, d) => { done() });
    });

    describe('success scenarios', () => {
      it('should create new booking', (done) => {
        const opts = {
          method: 'post',
          url: `${URL}/room-booking`,
          headers: {
            admin_key: ADMIN_KEY
          },
          json: {
            "room_type": "deluxe_rooms",
            "start_date": "2020-02-01",
            "end_date": "2020-02-10",
            "user_uid": "1"
          }
        }
        request(opts, (e, r, d) => {
          should(r.statusCode).eql(200);
          should(d).have.properties(["features", "title", "type", "price", "user_uid", "booking_from", "booking_to", "expiresAt", "created_at", "updated_at", "uid"]);
          done();
        })
      });
    });
    describe('faliure scenarios', () => {
      it('should retun error while booking', (done) => {
        const opts = {
          method: 'post',
          url: `${URL}/room-booking`,
          headers: {
            admin_key: ADMIN_KEY
          },
          json: {
            "room_type": "deluxe_rooms",
            "start_date": "2020-02-01",
            "end_date": "2020-02-10",
            "user_uid": "1"
          }
        }
        request(opts, (e, r, d) => {
          should(r.statusCode).eql(400);
          should(d).have.properties(["error"]);
          done();
        })
      });
    });
  });
});