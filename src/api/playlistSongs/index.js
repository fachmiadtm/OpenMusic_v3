/* eslint-disable function-paren-newline */
const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    service, validator, playlistActivitiesService, playlistsService,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      service, validator, playlistActivitiesService, playlistsService,
    );
    server.route(routes(playlistSongsHandler));
  },
};
