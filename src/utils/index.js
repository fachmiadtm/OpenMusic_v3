const mapDBSongToModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId : album_id
});

const mapDBAlbumToModel = ({
  album_id,
  name,
  year,
  songs = [],
}) => ({
  id : album_id,
  name,
  year,
  songs,
});



module.exports = { mapDBSongToModel, mapDBAlbumToModel };