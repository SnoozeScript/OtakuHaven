import PropTypes from 'prop-types';

const AnimePlayer = ({ id, episode, dub = 0, skip = 0 }) => {
  const videoUrl = `https://vidsrc.icu/embed/anime/${id}/${episode}/${dub}/${skip}`;

  return (
    <div className="anime-player">
      <iframe
        src={videoUrl}
        frameBorder="0"
        allowFullScreen
        title="Anime Player"
        style={{ width: '100%', height: '500px' }} // Adjust height as needed
      />
    </div>
  );
};

// PropTypes validation
AnimePlayer.propTypes = {
  id: PropTypes.number.isRequired,
  episode: PropTypes.number.isRequired,
  dub: PropTypes.number,
  skip: PropTypes.number,
};

export default AnimePlayer;
