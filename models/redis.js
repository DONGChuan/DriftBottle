/**
 * Created by dchuan on 2016/3/24.
 */
'use strict';

// Import modules
var redis = require('redis');
var uuid = require('node-uuid');

// Type of drift bottle
var type = { male: 0, female: 1};

function throwBottle(bottle, callback) {

    var client = redis.createClient();
    var bottleId = uuid.v4();
    bottle.time = bottle.time || Date.now();

    client.select(type[bottle.type], function () {

        client.hmset(bottleId, bottle, function (err, result) {

            if(err) {
                return callback({ code: 0, msg: '过会儿再试吧'});
            }

            client.expire(bottleId, 86400, function() {
                client.quit();
            });

            callback({ code: 1, msg: '成功扔出一个漂流瓶'});
        })
    })
}

function pickBottle(info, callback) {

    var client = redis.createClient();

    client.select(type[info.type], function() {
        client.randomkey(function(err, bottleId) {

            if(err) {
                return callback({ code: 0, msg: err });
            }

            if(!bottleId) {
                return callback({ code: 1, msg: '捞到一个海星' });
            }

            client.hgetall(bottleId, function(err, bottle) {
                if(err) {
                    return callback({ code: 0, msg: '这个瓶子破损了'});
                }

                // After get the bottle, remove it from DB
                client.del(bottleId, function() {
                    client.quit();
                });

                callback({ code: 1, msg: bottle });
            })
        })
    });
}


exports.throw = function (bottle, callback) {
    throwBottle(bottle, function(result) {
        callback(result);
    })
};

exports.pick = function (info, callback) {

    // By default, 20% chance no bottle
    if(Math.random() <= 0.2) {
        return callback({ code: 1, msg: '捞到一个海星' });
        }

    pickBottle(info, function(result) {
            callback(result);
    })
};
