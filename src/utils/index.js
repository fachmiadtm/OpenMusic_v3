const mapDBSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapDBAlbumWithSongs = (rows) => {
  const { album_id, name, year } = rows[0];
  const songs = rows[0].song_id
    ? rows.map((row) => ({
      id: row.song_id,
      title: row.title,
      performer: row.performer,
    }))
    : [];

  return {
    id: album_id,
    name,
    year,
    songs,
  };
};

const mapDBPlaylistWithSongs = (rows) => {
  const { playlist_id, name, username } = rows[0];
  const songs = rows[0].song_id
    ? rows.map((row) => ({
      id: row.song_id,
      title: row.title,
      performer: row.performer,
    }))
    : [];

  return {
    id: playlist_id,
    name,
    username,
    songs,
  };
};

module.exports = {
  mapDBSongToModel,
  mapDBAlbumWithSongs,
  mapDBPlaylistWithSongs,
};
