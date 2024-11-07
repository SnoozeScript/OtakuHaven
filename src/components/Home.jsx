import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Animated Heading */}
      <motion.h1 className="text-5xl font-extrabold text-purple-400 mb-8 text-center relative">
        {Array.from("Welcome to OtakuHaven!").map((char, index) => (
          <motion.span
            key={index}
            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Description with Fade-in Animation */}
      <motion.p
        initial={{ opacity: 0, filter: "blur(10px)", scale: 1.2 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="text-xl text-gray-300 mb-12 text-center max-w-2xl"
      >
        Welcome to OtakuHaven, where fandoms come alive—completely free, no
        account needed! Dive into our universe of anime, manga, movies, and TV
        shows. Discover unique recommendations and explore captivating stories.
        Ready to find your next favorite? Join us and let the adventure begin!
      </motion.p>

      {/* Section Cards with Enhanced Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Anime Section */}
        <Link
          to="/anime"
          className="group relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Anime</h2>
          <p className="text-gray-200 mb-6">
            From timeless classics to the latest trends, immerse yourself in the
            world of anime.
          </p>
          <button className="bg-white text-purple-600 font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:bg-purple-100">
            View Anime
          </button>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white bg-opacity-10 rounded-lg transition-all"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          ></motion.div>
        </Link>

        {/* Manga Section */}
        <Link
          to="/manga"
          className="group relative bg-gradient-to-br from-pink-600 to-red-600 rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Manga</h2>
          <p className="text-gray-200 mb-6">
            Explore captivating manga series with breathtaking art and
            storytelling.
          </p>
          <button className="bg-white text-pink-600 font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:bg-pink-100">
            View Manga
          </button>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white bg-opacity-10 rounded-lg transition-all"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          ></motion.div>
        </Link>

        {/* Movies Section */}
        <Link
          to="/movies"
          className="group relative bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Movies</h2>
          <p className="text-gray-200 mb-6">
            Catch the latest anime movies and enjoy unforgettable cinematic
            moments.
          </p>
          <button className="bg-white text-green-600 font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:bg-green-100">
            View Movies
          </button>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white bg-opacity-10 rounded-lg transition-all"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          ></motion.div>
        </Link>

        {/* TV Shows Section */}
        <Link
          to="/tvshows"
          className="group relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">TV Shows</h2>
          <p className="text-gray-200 mb-6">
            Discover binge-worthy TV shows and dive into epic story arcs.
          </p>
          <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:bg-blue-100">
            View TV Shows
          </button>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white bg-opacity-10 rounded-lg transition-all"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          ></motion.div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
