const { client } = require('..');

if(process.env.debug) {
	client.on('error', (error) => console.warn(error));
	client.on('warn', (error) => console.warn(error));
}