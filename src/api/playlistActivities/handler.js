const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(service, checkerService) {
    this._service = service;
    this._checkerService = checkerService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._checkerService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getActivities(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistActivitiesHandler;
