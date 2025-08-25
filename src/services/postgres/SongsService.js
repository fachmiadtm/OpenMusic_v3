const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBSongToModel } = require('../../utils');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    await this._cacheService.delete(`song:${id}`);
    await this._cacheService.delete('song:all');
    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let query;
    if (title && performer) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
        values: [`%${title}%`],
      };
    } else if (performer) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
        values: [`%${performer}%`],
      };
    } else {
      try {
        const result = await this._cacheService.get('song:all');
        return JSON.parse(result);
      } catch (error) {
        query = {
          text: 'SELECT id, title, performer FROM songs',
        };
        const result = await this._pool.query(query);
        const songs = result.rows.map(mapDBSongToModel);
        await this._cacheService.set('song:all', JSON.stringify(songs));
        return songs;
      }
    }

    const result = await this._pool.query(query);
    const songs = result.rows.map(mapDBSongToModel);
    return songs;
  }

  async getSongById(id) {
    try {
      const result = await this._cacheService.get(`song:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }
      const song = result.rows.map(mapDBSongToModel)[0];
      await this._cacheService.set(`song:${id}`, JSON.stringify(song));
      return song;
    }
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const query = {
      text: `UPDATE songs 
      SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 
      WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
    await this._cacheService.delete(`song:${id}`);
    await this._cacheService.delete('song:all');
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
    await this._cacheService.delete(`song:${id}`);
    await this._cacheService.delete('song:all');
  }
}

module.exports = SongsService;
