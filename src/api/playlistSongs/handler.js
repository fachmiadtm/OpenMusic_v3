const autoBind = require('auto-bind');
const { mapDBPlaylistWithSongs } = require('../../utils');

class PlaylistSongsHandler {
  constructor(service, validator, playlistActivitiesService, checkerService) {
    this._service = service;
    this._validator = validator;
    this._playlistActivitiesService = playlistActivitiesService;
    this._checkerService = checkerService;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._checkerService.verifyPlaylistAccess(playlistId, credentialId);
    await this._checkerService.songChecker(songId);

    const playlistSongId = await this._service.addSongToPlaylist(playlistId, songId);
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

  async getPlaylistSongsHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._checkerService.verifyPlaylistAccess(playlistId, credentialId);

    const getPlaylistWithSongs = await this._service.getPlaylistSongs(playlistId);
    const mappedPlaylistWithSongs = mapDBPlaylistWithSongs(getPlaylistWithSongs);

    const response = h.response({
      status: 'success',
      data: {
        playlist: mappedPlaylistWithSongs,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongByIdHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._checkerService.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSongById(playlistId, songId);
    await this._playlistActivitiesService.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongsHandler;
