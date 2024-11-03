import { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch('https://vidsrc.icu/embed/anime/{id}/{episode}/{}/{1}'); // Replace with your actual API endpoint
        if (!response.ok) throw new Error('Failed to fetch anime data');
        const data = await response.json();
        setAnimeData(data); // Assuming the API returns an array of anime objects
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="text-center">Anime List</h1>
      <div className="row">
        {animeData.map(anime => (
          <div className="col-md-4 mb-4" key={anime.id}>
            <AnimeCard
              id={anime.id}
              title={anime.title}
              image={anime.image}
              description={anime.description}
              rating={anime.rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
