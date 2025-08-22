const fs = require('fs');
const { Pool } = require('pg');
const config = require('../../utils/config');

class StorageService {
  constructor(folder) {
    this._pool = new Pool();
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addAlbumCoverURL(filename, id) {
    const albumCoverURL = `http://${config.app.host}:${config.app.host}/albums/${id}/covers/${filename}`;
    const query = {
      text: 'UPDATE albums SET album_cover = $1 WHERE id = $2',
      values: [albumCoverURL, id],
    };
    await this._pool.query(query);
  }
}

module.exports = StorageService;
