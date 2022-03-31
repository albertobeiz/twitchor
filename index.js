const tmi = require('tmi.js');

let game = {
  channel1Score: 0,
  channel2Score: 0,
  currentPlay: {},
};

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ['bbeiz'],
});

client.connect();

const options = ['rock', 'paper', 'scissors'];
client.on('message', (channel, tags, message, self) => {
  console.log(message);
  message = message.substring(1);

  if (!options.includes(message)) {
    return;
  }

  if (!game.currentPlay[channel]) {
    game.currentPlay[channel] = {};
  }

  if (!game.currentPlay[channel][message]) {
    game.currentPlay[channel][message] = new Set();
  }

  game.currentPlay[channel][message].add(tags.username);

  channel = '#otro';
  if (!game.currentPlay[channel]) {
    game.currentPlay[channel] = {};
  }

  if (!game.currentPlay[channel][message]) {
    game.currentPlay[channel][message] = new Set();
  }

  game.currentPlay[channel][message].add(tags.username);
});

setInterval(() => {
  const chosens = [];
  for (const channel in game.currentPlay) {
    const probs = [];
    const play = game.currentPlay[channel];

    for (const option in play) {
      for (const player of play[option]) {
        probs.push(option);
      }
    }

    const chosen = probs[Math.floor(Math.random() * probs.length)];
    console.log(channel, chosen);
    chosens.push(chosen);
  }

  const player1 = chosens[0];
  const player2 = chosens[1];

  console.log(chosens);

  if (player1 === player2) {
  } else if (player1 == 'rock') {
    player2 == 'paper' ? game.channel2Score++ : game.channel1Score++;
  } else if (player1 == 'scissors') {
    player2 == 'rock' ? game.channel2Score++ : game.channel1Score++;
  } else if (player1 == 'paper') {
    player2 == 'scissors' ? game.channel2Score++ : game.channel1Score++;
  }

  console.log(game.channel1Score, ' - ', game.channel2Score);

  game.currentPlay = {};
}, 20000);
