import { useParams } from 'react-router-dom';

const AnimeDetail = () => {
  const { id } = useParams(); // Get the anime ID from the URL parameters
  const episode = 1; // Set the default episode number; you might want to change this based on your use case
  const dub = 0; // Set this to 1 for dub and 0 for sub
  const skip = 1; // Set this to 1 to auto-skip intro/outro, or 0 to not skip

  // Construct the video URL using the VidSrc endpoint
  const videoUrl = `https://vidsrc.icu/embed/anime/${id}/${episode}/${dub}/${skip}`;

  return (
    <div className="container mt-4">
      <h1 className="text-center">Anime Detail</h1>
      <div className="embed-responsive embed-responsive-16by9">
        <iframe
          className="embed-responsive-item"
          src={videoUrl}
          title="Anime Player"
          allowFullScreen
          style={{ border: 'none' }} // Remove iframe border
        ></iframe>
      </div>
    </div>
  );
};

export default AnimeDetail;