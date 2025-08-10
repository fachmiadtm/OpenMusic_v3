const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { service, checkerService }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(service, checkerService);
    server.route(routes(playlistActivitiesHandler));
  },
};
