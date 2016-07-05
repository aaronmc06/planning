var addroutes, requireDirectory, settings;

settings = global.apps[global.namespace];

requireDirectory = require('require-directory');

module.exports = function(server) {
  var controller, routes;
  controller = requireDirectory(module, './server/controllers');
  routes = [
    {
      method: 'GET',
      path: settings.web.weburl + '/{path*}',
      handler: {
        directory: {
          path: settings.app.dir.webdir,
          listing: false,
          index: true
        }
      }
    }
  ];

  return routes;
};