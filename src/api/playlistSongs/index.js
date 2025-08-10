/* eslint-disable function-paren-newline */
const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    service, validator, playlistActivitiesService, checkerService,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      service, validator, playlistActivitiesService, checkerService,
    );
    server.route(routes(playlistSongsHandler));
  },
};
