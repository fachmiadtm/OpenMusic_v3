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
}) => ({
  id : album_id,
  name,
  year
});



module.exports = { mapDBSongToModel, mapDBAlbumToModel };