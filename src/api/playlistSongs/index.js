const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { service, validator, playlistActivitiesService }) => {
    // eslint-disable-next-line max-len
    const playlistSongsHandler = new PlaylistSongsHandler(service, validator, playlistActivitiesService);
    server.route(routes(playlistSongsHandler));
  },
};
