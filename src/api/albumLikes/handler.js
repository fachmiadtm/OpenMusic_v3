const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, checkerService) {
    this._service = service;
    this._checkerService = checkerService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._checkerService.albumChecker(albumId);
    await this._checkerService.likeChecker(albumId, userId);
    await this._service.addLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.deleteLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const { source, likes } = await this._service.getLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    response.code(200);
    return response;
  }
}

module.exports = AlbumLikesHandler;
