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
  console.log("CONNECTED " + socket.name)

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
    console.log("DISCONNECTED " + socket.name)
    console.log("CLIENTS_LEFT " + clients.length)
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