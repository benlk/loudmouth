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

var quotes, memes, remarks;

fs.readFile('data/quotes.json', function(err, data) {
  if (err) throw err;
  quotes = JSON.parse(data);
});

fs.readFile('data/memes.json', function(err, data) {
  if (err) throw err;
  memes = JSON.parse(data);
});

fs.readFile('data/remarks.json', function(err, data) {
  if (err) throw err;
  remarks = JSON.parse(data);
});




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

  function reply(){
    var found = false;

    for (var i = 0; i < buzzWords.length && !found; i++) {
      if ( text.indexOf(buzzWords[i]) > -1 ) {
        if (text.startsWith('.addbuzz') || text === '.zen') return
        found = true;
        wait = true;

        var content;

        switch (buzzWords[i]) {
          case 'the cloud':
            content = from + ': There is no cloud. It\'s just someone else\'s computer';
            break;

          case 'hacker':
            content = from + ': Who is this hacker, 4chan?';
            break;

          case 'big data':
            content = 'Big data is like teenage sex\: everyone talks about it, nobody really knows how to do it, everyone thinks everyone else is doing it, so everyone claims they are doing it . . .';
            break;
          case 'iot':
          case 'internet of things':
            var appliances = ['humidifier', 'toaster', 'microwave', 'refrigerator', 'coffee maker', 'furnace'];

            function isDifferent(value) {
              return value !== x;
            }

            var x = appliances[Math.floor(Math.random() * appliances.length)];
            var y = appliances.filter(isDifferent)[Math.floor(Math.random() * (appliances.length - 1) )];

            content = from + ': Your ' + x + ' \'liked\' your ' + y + '\'s status update.';
            break;

          case 'startup':
            content = 'Checkout this new startup? http://tiffzhang.com/startup';
            break;

          case 'agile development':
            content = 'Agile\: Bastardized by managers since 2001.';
            break;

          case 'html5':
            content = 'How to tell HTML from HTML5\: Try it out on Internet Explorer. Did it work? No? It\'s HTML5';
            break;

          case 'web 2.0':
            content = 'web 2.0\: You make all the content. They keep all the revenue.';
            break;

          case 'buzzword':
            content = 'http://cdn.meme.am/instances/59116449.jpg';
            break;

          case 'seo':
          case 'search engine optimization':
            content = 'Like Voodoo and Witchdoctors, \"SEO\" is an evil term used to describe the ways SEO Optimizers believe they can beat the system by making you believe they know what will get your search ranking to the top';
            break;

          default:
            content = '[' + buzzWords[i] + '] ' + memes[Math.floor(Math.random() * memes.length)];
        }

        client.say(channel, content);

        setTimeout(function () {
          wait = false;
        }, 5000);

      }
    }

  }

  if (!wait) reply();



  if (text.startsWith('.addbuzz') && admins.indexOf(from) > -1) {
    var words = text.slice(9, text.length).split(',');

    for (var i = 0; i < words.length; i++) {
      fs.appendFile(filePath, '\n' + words[i].trim(), function(err) {

        if (err) return console.error('write error: ' + err);
        updateWords();

        var update = from + ': ' +  words + ' added to buzzwords';

        client.say(channel, update);

      });
    }
  }



  if ( text === '.zen' ) {
    var quote = quotes[Math.floor(Math.random() * quotes.length)];
    client.say(channel, quote);
  }


  if ( text.indexOf(nick) > -1 ) {

    if ( text.indexOf('annoy') > -1 || text.indexOf('hate') > -1 ) {

      remark = remarks[Math.floor(Math.random() * remarks.length)];

      var self = '/me';

      if (remark.startsWith(self)) {
        client.action(channel, remark.slice(self.length + 1, remark.length));
      } else {
        client.say(channel, remark);
      }


    }

  }


  if ( text.indexOf(nick) > -1 && text.indexOf('turing') > -1 ) {
    client.say(channel, from + ': I am indeed self-aware, just ahhh . . . don\'t ask me anything else');
  }





});
