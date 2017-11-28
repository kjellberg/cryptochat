var ursa = require('ursa');
var net = require('net');
var key = ""
var privkeypem = ""
var pubKeyBase64 = ""
generateKeyPair();

var client = new net.Socket();

client.connect(6000, '138.68.71.75', function() {
  client.write("PING");
});

client.on('data', function(data) {
  args = data.toString().split(" ");
  if ("PRIVM" == args[0] && pubKeyBase64 == args[1]) {
    message = args.slice(2).join(" ")
    decoded_message = key.decrypt(message, 'base64', 'utf8');
    console.log("Received: " + decoded_message)
  }
});

function generateKeyPair() {
  key = ursa.generatePrivateKey(1024, 65537);
  var buff = new Buffer(key.toPublicPem());
  privkeypem = key.toPrivatePem();
  pubKeyBase64 = buff.toString('base64');

  console.log("Public Key: " + pubKeyBase64)
}

function sendMessage(receipent_base64_key, message) {
  public_key = new Buffer(receipent_base64_key, 'base64').toString('ascii')
  crt = ursa.createPublicKey(public_key)
  encoded_message = crt.encrypt(message, 'utf8', 'base64');
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