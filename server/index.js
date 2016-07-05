var routes, settings;

settings = global.apps[global.namespace].app.dir;

routes = require(settings.configdir + '/routes');

module.exports.routes = routes();