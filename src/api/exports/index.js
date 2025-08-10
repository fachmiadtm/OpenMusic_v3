const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, checkerService, validator }) => {
    const exportsHandler = new ExportsHandler(service, checkerService, validator);
    server.route(routes(exportsHandler));
  },
};
