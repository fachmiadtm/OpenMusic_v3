const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(service, checkerService, validator) {
    this._service = service;
    this._checkerService = checkerService;
    this._validator = validator;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._checkerService.verifyPlaylistOwner(playlistId, credentialId);
    await this._checkerService.playlistChecker(playlistId);
    await this._checkerService.userChecker(userId);
    const collaborationId = await this._service.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._checkerService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
