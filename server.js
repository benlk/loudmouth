var http = require('http');
var irc = require('irc');
var fs = require('fs');
var argv = require('yargs').argv;
const chalk = require('chalk');


var port, server, channel, nick;

(argv.port) ? port = argv.port: port = 6667;
(argv.server) ? server = argv.server.toLowerCase(): server = 'irc.freenode.net';
(argv.nick) ? nick = argv.nick.toLowerCase(): nick = 'loudmouth';

if (argv.channel) {
  channel = argv.channel.toLowerCase();
} else {
  return console.log('please specify a channel');
}


var client = new irc.Client(server, nick, {
  autoRejoin: true,
  autoConnect: false,
  port: port,
  userName: nick,
  secure: false,
  encoding: 'UTF-8'
});


client.connect(5, function(input) {
  console.log(chalk.green('Established connection with ' + server));

  client.join(channel, function(input) {
    console.log(chalk.green('Joined ' + channel));
  });
});


client.addListener('error', function(message) {
  console.log('error: ', message);
});


var filePath = 'seed.txt';

fs.readFile(filePath, function(err, data) {
  if (err) throw err;
  buzzWords = data.toString().split("\n");
});


client.addListener('message', function(from, to, text) {

  var length = buzzWords.length;

  while(length--) {
    if (text.indexOf(buzzWords[length])!=-1) {
       client.say(channel, 'BUZZWORD');
     }
  }
  // if (buzzWords.indexOf(text.toLowerCase()) !== -1) {
  //   client.say(channel, 'BUZZWORD');
  // }

  if (text.indexOf('.addbuzz') > -1) {

    var words = text.split(' ', 2);
    var content = words[words.length - 1];

    if (buzzWords.indexOf(content) === -1) {

      fs.appendFile(filePath, '\n' + content, function(err) {
        if (err) {
          return console.log(chalk.red(err));
        }
      });

      client.say(channel, '\'' + content + '\' added to buzzwords');

    } else {
      client.say(channel, '\'' + content + '\' has already been added');
    }

  }

});
