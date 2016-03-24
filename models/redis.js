/**
 * Created by dchuan on 2016/3/24.
 */
var redis = require('redis');

var client = redis.createClient();

client.select(1, function () {
    client.hmset('user', {
        'name': 'testName',
        'addr': 'testAddr'
    }, function () {
        client.quit();
    });
});

