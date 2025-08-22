const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(albumId, userId) {
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2)',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Like gagal ditambahkan');
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Like tidak ditemukan.');
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return {
        source: 'cache',
        likes: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = Number(result.rows[0].likes);

      await this._cacheService.set(`album-likes:${albumId}`, JSON.stringify(likes));
      return {
        source: 'db',
        likes,
      };
    }
  }
}

module.exports = AlbumLikesService;
