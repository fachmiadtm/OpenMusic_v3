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

const mapDBAlbumToModel = ({
  id,
  name,
  year,
  songs = [],
}) => ({
  id,
  name,
  year,
  songs,
});

module.exports = { mapDBSongToModel, mapDBAlbumToModel };
