var http = require('http');
var irc = require('irc');
var fs = require('fs');
var argv = require('yargs').argv;
const chalk = require('chalk');

var port, server, channel, nick, admins;

(argv.port) ? port = argv.port: port = 6667;
(argv.server) ? server = argv.server.toLowerCase(): server = 'irc.freenode.net';
(argv.nick) ? nick = argv.nick.toLowerCase(): nick = 'loudmouth';

if (argv.admin) {
  admins = argv.admin.toLowerCase().replace(' ', '').split(',');
} else {
  return console.log('please specify admin(s) with --admin=\'foo, bar\' ');
}

if (argv.channel) {
  channel = argv.channel.toLowerCase();
} else {
  return console.log('please specify a channel with --channel=\'#foo\' ');
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


var wait = false;
updateWords();


client.addListener('message', function(from, to, text) {

  function reply(content){
    var found = false;

    for (var i = 0; i < buzzWords.length && !found; i++) {
      if ( text.indexOf(buzzWords[i]) > -1 ) {
        if (text.startsWith('.addbuzz')) return
        found = true;
        wait = true;
        client.say(channel, from + ': ' + content);

        setTimeout(function () {
          wait = false;
        }, 10000);

      }
    }

  }

  if (!wait) reply('BUZZWORD!');

  if (text.startsWith('.addbuzz') && admins.indexOf(from) > -1) {
    var words = text.slice(9, text.length).split(',');

    for (var i = 0; i < words.length; i++) {
      fs.appendFile(filePath, '\n' + words[i].trim(), function(err) {

        if (err) return console.error('write error: ' + err);
        updateWords();

      });
    }

  }

});
