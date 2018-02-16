'use strict';

var defineProperty = require('./properties.js').defineProperty;

var crypto = global.crypto || global.msCrypto;
if (!crypto || !crypto.getRandomValues) {
    console.log('WARNING: Missing strong random number source; using weak randomBytes');
  crypto = {
    getRandomValues: function(buffer) {
      var randomBytes = require('react-native-randombytes')
      console.log('NOTICE: Generating using react-native-randombytes');

      for (var round = 0; round < 20; round++) {
        for (var i = 0; i < buffer.length; i++) {
          const rand = randomBytes.randomBytes(1);
          const hex = rand.toString('hex');

          if (round) {
            buffer[i] ^= parseInt(hex, 16);
            // buffer[i] ^= parseInt(256 * Math.random()); // Old Version

          } else {
            buffer[i] = parseInt(hex, 16);
            // buffer[i] = parseInt(256 * Math.random()); // Old Version
          }
        }
      }
      return buffer;
    },
    _weakCrypto: false
  };
} else {
    console.log('Found strong random number source');
}

function randomBytes(length) {
    if (length <= 0 || length > 1024 || parseInt(length) != length) {
        throw new Error('invalid length');
    }

    var result = new Uint8Array(length);
    crypto.getRandomValues(result);
    return result;
};

if (crypto._weakCrypto === true) {
    defineProperty(randomBytes, '_weakCrypto', true);
}

module.exports = randomBytes;
