const fs = require('fs');
const client = require('../index');


fs.readdir('events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		console.info('Ingeladen event:' + file.split('.')[0]);
		const event = require(`../events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
	});
});