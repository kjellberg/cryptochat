var net = require('net');
var NodeRSA = require('node-rsa');

var key = ""
var privkeypem = ""
var pubKeyBase64 = ""

generateKeyPair();

var client = new net.Socket();

client.connect(6000, '::1', function() {
  client.write("PING");
});

client.on('data', function(data) {
  args = data.toString().split(" ");
  if ("PRIVM" == args[0] && pubKeyBase64 == args[1]) {
    message = args.slice(2).join(" ")
    decoded_message = key.decrypt(message);
    console.log("Received: " + decoded_message)
  }
});

function generateKeyPair() {
  key = new NodeRSA({b: 512});

  privkeypem = key.exportKey('private')
  pubKeyBase64 = new Buffer(key.exportKey('pkcs8-public')).toString('base64');

  console.log("Public Key: " + pubKeyBase64)
}

function sendMessage(receipent_base64_key, message) {

  public_key = new Buffer.from(receipent_base64_key, 'base64').toString("ascii")

  var receipent_public_key = new NodeRSA(public_key,'pkcs8-public')
  encoded_message = receipent_public_key.encrypt(message, 'base64', 'utf8');

  client.write("PRIVM " + receipent_base64_key + " " + encoded_message)
}

process.stdin.resume();
process.stdin.on("data",function(data) {
  args = data.toString().split(" ");
  if (args[0] == "PRIVM") {
    message = args.slice(2).join(" ")
    sendMessage(args[1], message)
  }
})