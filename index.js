var result, settings;

settings = require('./settings.js');

if (settings.general.status === 'enable') {
	  console.log(settings.console.headertext);
	  result = require(settings.app.dir.rootdir + '/server');
} else {
	  result = {};
	  result.routes = [];
}

module.exports = result;