const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(service, validator, playlistActivitiesService) {
    this._service = service;
    this._validator = validator;
    this._playlistActivitiesService = playlistActivitiesService;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    const playlistSongId = await this._service.addSongtoPlaylist(playlistId, songId);
    await this._playlistActivitiesService.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    const playlistSongs = await this._service.getPlaylistSongs(playlistId);
    return {
      status: 'success',
      data: {
        playlist: playlistSongs,
      },
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistSongById(playlistId, songId);
    await this._playlistActivitiesService.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
    });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
