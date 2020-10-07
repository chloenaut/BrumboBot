/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'cweather',
	description: 'gets the current weather',
	cooldown:240,
	execute(message, args) {
		if(!args.length || args.length > 1) return message.channel.send('Usage: $cweather [US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree)e.g: 48.8567,2.3508 or city name]');
		const api_url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${args[0]}`;
		let data;
		async function getCurrWeather()	{
			const response = await fetch(api_url)
				.catch(err => {
					console.error(err);
					// TODO error code handling
					return message.reply('there was an error trying to execute that command!');
				})
				.then(res => res.json())
				.then(json => data = json);
			const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
			const userEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${data.location.name} Weather`)
				.setDescription(`Local time: ${data.location.localtime}`)
				.setAuthor(message.author.username, avatar, avatar)
				.addFields(
					{ name: 'Temp', value: `${data.current.temp_c}°C | ${data.current.temp_f}°F` },
					{ name: 'Feels Like', value: `${data.current.feelslike_c}°C | ${data.current.feelslike_f}°F` },
					{ name: 'Humidity', value:`${data.current.humidity}%` },
					{ name: 'Cloud Cover', value:`${data.current.cloud}%` },
					{ name: 'Condition', value: `${data.current.condition.text}` },
					)
				.setImage(`http:${data.current.condition.icon}`)
				.addField('Data Last Updated', data.current.last_updated)
				.setTimestamp()
				.setFooter('brumbo', avatar);
			message.channel.send(userEmbed);
		}
		try {
			getCurrWeather();
		}
		catch(error) {
			console.error(error);
			return message.reply('there was an error trying to execute that command!');
		}
	},
};