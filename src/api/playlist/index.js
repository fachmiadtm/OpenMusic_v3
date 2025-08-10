const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, checkerService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, checkerService, validator);
    server.route(routes(playlistsHandler));
  },
};
