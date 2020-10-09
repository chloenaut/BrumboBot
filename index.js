/* eslint-disable curly */
/* eslint-disable no-unreachable */
const fs = require('fs');
const Discord = require('discord.js');
const winston = require('winston');
const express = require('express');
require('dotenv').config({ path: './.env' });

// console.log(process.env);

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3200;
app.get('/', (request, response) => {
  console.log(Date.now() + ' Ping Received');
  response.sendStatus(200);
});
const listener = server.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


// Logger

const logger = winston.createLogger({
        transports: [
		new winston.transports.Console(),
		// new winston.transports.File({ filename: 'discordBotLog' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});


const client = new Discord.Client();
const broadcasts = {};
const commandList = {};
const cooldowns = {};

// get commandsc
const commandFiles = fs.readdirSync(`${process.env.INIT_CWD}/Commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const module = require(`${process.env.INIT_CWD}/Commands/${file}`);
    for (const command in module.commands)
        commandList[command] = module.commands[command];
}

client.on('ready', () => {
    logger.log('info', 'Logged in as: ' + client.user.tag);
    client.user.setActivity('brumbo', { type: 'WATCHING' });
    commandList['help'] = {
        name:'help',
        description:'help!',
        execute(message, args) {
            message.channel.send(commandList.map(command => '**' + command.name + '**' + '\n`' + command.description + '`\n').join(''));
        },
    };
});

client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
process.on('uncaughtException', error => logger.log('error', error));

function urMom() {
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            return 'no ur mom';
            break;
        case 1:
            return 'fuck u';
            break;
        case 2:
            return 'no u';
            break;
    }
}

client.on('message', message => {
    if (message.author.bot) return;
    const user = message.author;

    const responseObject = {
       'walter': 'Walter',
       'todd' : 'Todd!',
       'bees' : 'SHIT!! WHERE??!',
       'brumbo' : 'no u',
       'michael jackson' : 'https://www.youtube.com/watch?v=rlgzzWTurf4',
       'psst' : 'ʸᵉᵃ ʷʰᵃᵗ\'ˢ ᵘᵖˀ',
       'ur mom' : urMom(),
    };

    const msg = message.content.toLowerCase();
    if (!message.content.startsWith(process.env.PREFIX) && !responseObject[msg]) return;
    try {
        if(responseObject[msg]) return message.channel.send(responseObject[msg]);
    }
    catch(error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!commandList[command]) return;

    if (!cooldowns[command.name]) cooldowns[command.name] = {};
    const now = Date.now();
    const timestamps = cooldowns[command.name];
    const cooldownAmount = (commandList[command].cooldown || 3) * 1000;
    if (timestamps[message.author.id]) {
        const expirationTime = timestamps[message.author.id] + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${ commandList[command].name}\` command.`);
        }
    }
    timestamps[message.author.id] = now;
    setTimeout(() => delete timestamps[message.author.id], cooldownAmount);

    try {
        commandList[command].execute(message, args, broadcasts);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(process.env.TOKEN);