var smoke = require('smokesignal')

process.stdin.setEncoding('utf8')

var node = smoke.createNode({
  port: parseInt(process.argv[2]) || 8945
, address: '138.68.71.75'
, seeds: [{port: 8945, address:'138.68.71.75'}] //<-- You may need to change this address!
})

console.log('Port', node.options.port)
console.log('IP', node.options.address)
console.log('ID', node.id)

console.log('Connecting...');

node.on('connect', function() {
  console.log('Connected. Happy chatting!\n');
})

node.on('disconnect', function() {
  console.log('Disconnected. Sorry.');
})

// Send message
process.stdin.pipe(node.broadcast).pipe(process.stdout)

node.on('error', function(e) {throw e})
node.start()