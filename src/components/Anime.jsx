import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { searchAnime } from '../api';
import AnimeCard from './AnimeCard';

const Anime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const query = searchParams.get('search') || 'popular';
        const genre = searchParams.get('genre') || '';
        const data = await searchAnime(query, genre);
        setAnimeList(data);
        setSearchQuery(query);
        setSelectedGenre(genre);
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    setSearchParams({ search: query, genre: selectedGenre });
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setSearchParams({ search: searchQuery, genre });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            name="search"
            placeholder="Search anime..."
            className="px-4 py-2 rounded-l-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue={searchQuery}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded-r-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Anime Genres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleGenreSelect('')}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedGenre === '' ? 'bg-purple-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {[...new Set(animeList.flatMap((anime) => anime.genres))].map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedGenre === genre ? 'bg-purple-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Anime Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default Anime;