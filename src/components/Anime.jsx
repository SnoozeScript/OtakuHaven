import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchAnime } from "../api";
import AnimeCard from "./AnimeCard";

const Anime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const query = searchParams.get("search") || "Popular";
        const genre = searchParams.get("genre") || "";
        const data = await searchAnime(query, genre);
        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  // Get search query and genre for the message
  const query = searchParams.get("search") || "recent";
  const genre = searchParams.get("genre") || "";
  const displayMessage = genre ? `Results for "${query}" in "${genre}" genre:` : `Results for "${query}"`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Result Message */}
      <h2 className="text-xl font-bold mb-4">{displayMessage}</h2>
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
