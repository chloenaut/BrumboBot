/* eslint-disable no-unreachable */
const fs = require('fs');
const Discord = require('discord.js');
const winston = require('winston');
const express = require('express');
require('dotenv').config({ path: './.env' });
console.log(process.env);

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
/* (setInterval(() => {
    }, 280000);
*/
const client = new Discord.Client();
// Logger

const logger = winston.createLogger({
        transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'discordBotLog' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

// get commands
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('ready', () => logger.log('info', 'Logged in as: ' + client.user.tag));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));

process.on('uncaughtException', error => logger.log('error', error));

function urMom(message) {
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            return 'no ur mom';
            break;
        case 1:
            return 'fuck u';
            break;
        case 2:
            return message.guild.emojis.cache.find(emoji => emoji.name === 'SaySike').toString();
            break;
        case 3:
            return 'no u';
            break;
    }
}

client.on('message', message => {
    const user = message.author;
    if(!message.author.bot) logger.log('info', user.username + ': ' + message.content);

    const responseObject = {
       'walter': 'Walter ' + message.guild.emojis.cache.find(emoji => emoji.name === 'walter').toString(),
       'todd' : 'Todd!',
       'bees' : 'SHIT!! WHERE??!',
       'brumbo' : 'no u',
       'michael jackson' : 'https://www.youtube.com/watch?v=rlgzzWTurf4',
       'psst' : 'ʸᵉᵃ ʷʰᵃᵗ\'ˢ ᵘᵖˀ',
       'ur mom' : urMom(message),
    };

    try {
        const msg = message.content.toLowerCase();
        if(!message.author.bot && responseObject[msg]) message.channel.send(responseObject[msg]);
    }
    catch(error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        client.commands.get(command).execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(process.env.TOKEN);