const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'weather',
	commands:{
		cweather:{
			description: 'gets the current weather',
			cooldown: 5,
			execute(message, args) {
				if(!args.length || args.length > 1) return message.channel.send('Usage: $cweather [US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree)e.g: 48.8567,2.3508 or city name]');
				const api_url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${args[0]}`;
				let data;
				async function getCurrWeather()	{
					const response = await fetch(api_url)
						.then(res => res.json())
						.then(json => data = json)
						.catch(err => {
							console.error(err);
							return message.channel.send('there was an error trying to execute that command!');
					});
					if ('error' in data) {
						if (data.error.code == 1006)return message.channel.send('Could not find that location!');
						else if  (data.error.code == 2007)return message.channel.send('Request Quota for API has been reached. Sorry for the inconvenience.');
						else return message.channel.send('there was an error trying to execute that command!');
					}
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
		},
		moon: {
			description: 'gets astro data',
			cooldown: 5,
			execute(message, args) {
				if(!args.length || args.length > 1) return message.channel.send('Usage: $cweather [US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree)e.g: 48.8567,2.3508 or city name]');

				let today = new Date();
				const dd = String(today.getDate()).padStart(2, '0');
				const mm = String(today.getMonth() + 1).padStart(2, '0');
				const yyyy = today.getFullYear();
				today = yyyy + '-' + mm + '-' + dd;
				const api_url = `http://api.weatherapi.com/v1/astronomy.json?key=${process.env.WEATHER_API_KEY}&q=${args[0]}&dt${today}`;
				let data;
				async function getAstroData()	{
					const response = await fetch(api_url)
						.then(res => res.json())
						.then(json => data = json)
						.catch(err => {
							console.error(err);
							return message.channel.send('there was an error trying to execute that command!');
					});
					if ('error' in data) {
						if (data.error.code == 1006)return message.channel.send('Could not find that location!');
						else if  (data.error.code == 2007)return message.channel.send('Request Quota for API has been reached. Sorry for the inconvenience.');
						else return message.channel.send('there was an error trying to execute that command!');
					}
					const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
					const userEmbed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`${data.location.name} Astro`)
						.setDescription(`Local time: ${data.location.localtime}`)
						.setAuthor(message.author.username, avatar, avatar)
						.addFields(
							{ name: 'Sunrise', value: `${data.astronomy.astro.sunrise}` },
							{ name: 'Sunset', value: `${data.astronomy.astro.sunset}` },
							{ name: 'Moonrise', value:`${data.astronomy.astro.moonrise}` },
							{ name: 'Moonset', value:`${data.astronomy.astro.moonset}` },
							{ name: 'Moon Phase', value: data.astronomy.astro.moon_phase + ' ' + ':' + data.astronomy.astro.moon_phase.toLowerCase().replace(/ /g, '_') + '_moon:' },
							{ name: 'Moon Illumination', value: `${data.astronomy.astro.moon_illumination}%` },
							)
						.setTimestamp()
						.setFooter('brumbo', avatar);
					message.channel.send(userEmbed);
				}
				try {
					getAstroData();
				}
				catch(error) {
					console.error(error);
					return message.reply('there was an error trying to execute that command!');
				}
			},
		},
	},
};