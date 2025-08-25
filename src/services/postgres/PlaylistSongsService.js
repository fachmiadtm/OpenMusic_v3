const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBPlaylistWithSongs } = require('../../utils');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    await this._cacheService.delete(`playlist-songs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist-songs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT playlists.id AS playlist_id, playlists.name, users.username,
      songs.id AS song_id, songs.title, songs.performer
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
      LEFT JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }

      const playlistWithSong = mapDBPlaylistWithSongs(result.rows);
      await this._cacheService.set(`playlist-songs:${playlistId}`, JSON.stringify(playlistWithSong));
      return playlistWithSong;
    }
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu di playlist. Id lagu tidak ditemukan');
    }
    await this._cacheService.delete(`playlist-songs:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
