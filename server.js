var http = require('http');
var irc = require('irc');
var fs = require('fs');
var argv = require('yargs').argv;
const chalk = require('chalk');


var port, server, channel, nick;

(argv.port) ? port = argv.port: port = 6667;
(argv.server) ? server = argv.server.toLowerCase(): server = 'irc.freenode.net';
(argv.nick) ? nick = argv.nick.toLowerCase(): nick = 'loudmouth';

if (argv.admin) {
  admin = argv.admin.toLowerCase();
} else {
  return console.log('please specify an admin');
}

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

function updateWords() {
  fs.readFile(filePath, function(err, data) {
    if (err) throw err;
    buzzWords = data.toString().split("\n");
  });
}

updateWords();

client.addListener('message', function(from, to, text) {

  var found = false;

  for (var i = 0; i < buzzWords.length && !found; i++) {
    if ( text.includes(buzzWords[i]) ) {

      if (text.slice(0,8) === '.addbuzz') return

      found = true;
      client.say(channel, from + ': BUZZWORD!');
    }
  }


  if (text.slice(0,8) === '.addbuzz' && from == admin) {
    var len = text.length;
    var words = text.slice(9, len).split(',');

    for (var i = 0; i < words.length; i++) {
      fs.appendFile(filePath, '\n' + words[i].trim(), function(err) {

        if (err) return console.log(err);
        updateWords();
      });
    }
  }

});
