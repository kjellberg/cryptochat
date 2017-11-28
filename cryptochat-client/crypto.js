var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});
var publicDer = key.exportKey('public');
var privateDer = key.exportKey('private');

console.log(privateDer);