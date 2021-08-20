const fs = require('fs');

const getFiles = path => {
	const files = [];
	for (const file of fs.readdirSync(path)) {
		const fullPath = path + '/' + file;
		if(fs.lstatSync(fullPath).isDirectory()) {
			getFiles(fullPath).forEach(x => files.push(file + '/' + x));
		}
		else {
			files.push(file);
		}
	}
	return files;
};

module.exports = { getFiles };