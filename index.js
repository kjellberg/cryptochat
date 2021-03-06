var smoke = require('smokesignal')

process.stdin.setEncoding('utf8')

var node = smoke.createNode({
  port: parseInt(process.argv[2]) || 8945
, address: '0.0.0.0'
, seeds: [{port: 14, address:'138.68.71.75'}] //<-- You may need to change this address!
})

console.log('Port', node.options.port)
console.log('IP', node.options.address)
console.log('ID', node.id)

node.on('connect', function() {
  console.log('Found peers - connected.!\n');
})

node.on('disconnect', function() {
  console.log('Disconnected. All peers gone.');
})

// Send message
process.stdin.pipe(node.broadcast).pipe(process.stdout)

node.on('error', function(e) {throw e})
node.start()

var net = require("net");
var server = net.createServer();
var port = 6000;
var clients = [];

var nameIndex = 0;
function generateIdentifier() {
  nameIndex++;
  return "client" + nameIndex;
}

server.on("connection", function(socket) {
  socket.setEncoding("utf8")
  socket.name = generateIdentifier();
  clients.push(socket)

  socket.on("data", function(data) {
    console.log(socket.name + " > " + data)
    args = data.toString().split(" ")

    if (args[0] == "PING") {
      socket.write("PONG\n")
      console.log(socket.name + " < PONG")
      return;
    }

    if (args[0] == "PRIVM") {
      broadcast(data)
      return;
    }

  })

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  })

  function broadcast(data) {
    var broadcast = ""
    for (var i = 0, len = clients.length; i < len; i++) {
      if (socket.name == clients[i].name) {
        continue
      }
      clients[i].write(data + "\n")
    }
  }

})

server.listen(port, function() {
  console.log("Listening for connections on %j", server.address())
})