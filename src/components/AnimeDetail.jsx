import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isDub, setIsDub] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      const client = new GraphQLClient('https://graphql.anilist.co');
      const query = gql`
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            description
            episodes
            coverImage {
              large
            }
            genres
            status
            season
            seasonYear
          }
        }
      `;

      try {
        const response = await client.request(query, { id: parseInt(id) });
        setAnime(response.Media);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  useEffect(() => {
    // Update video URL based on current episode, dub, and auto-skip settings
    setVideoUrl(`https://vidsrc.icu/embed/anime/${id}/${currentEpisode}/${isDub ? '1' : '0'}${autoSkip ? '/1' : ''}`);
  }, [id, currentEpisode, isDub, autoSkip]);

  const handleEpisodeChange = (newEpisode) => {
    if (newEpisode >= 1 && newEpisode <= (anime?.episodes || 1)) {
      setCurrentEpisode(newEpisode);
    }
  };

  if (!anime) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative pt-[56.25%] bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              src={videoUrl}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => handleEpisodeChange(currentEpisode - 1)}
              disabled={currentEpisode === 1}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-500"
            >
              Prev
            </button>

            <span className="text-lg font-semibold">Episode {currentEpisode}</span>

            <button
              onClick={() => handleEpisodeChange(currentEpisode + 1)}
              disabled={currentEpisode === anime.episodes}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-500"
            >
              Next
            </button>

            <button
              onClick={() => setIsDub(!isDub)}
              className={`px-4 py-2 rounded ${isDub ? 'bg-purple-500' : 'bg-gray-700'}`}
            >
              {isDub ? 'DUB' : 'SUB'}
            </button>
            <button
              onClick={() => setAutoSkip(!autoSkip)}
              className={`px-4 py-2 rounded ${autoSkip ? 'bg-purple-500' : 'bg-gray-700'}`}
            >
              Auto Skip {autoSkip ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Episodes</h2>
            <div className="grid grid-cols-8 gap-2">
              {[...Array(anime.episodes || 0)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEpisode(index + 1)}
                  className={`p-2 rounded ${
                    currentEpisode === index + 1
                      ? 'bg-purple-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="w-full rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{anime.title.romaji}</h1>
          <p className="text-gray-400 mb-4">{anime.description}</p>
          <div className="space-y-2">
            <p><span className="font-semibold">Status:</span> {anime.status}</p>
            <p><span className="font-semibold">Episodes:</span> {anime.episodes}</p>
            <p><span className="font-semibold">Season:</span> {anime.season} {anime.seasonYear}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-purple-500 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
