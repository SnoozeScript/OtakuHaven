import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Manga from "./pages/Manga";
import AnimeDetails from "./components/AnimeDetail";
import TvShows from "./pages/TvShows";
import Movies from "./pages/Movies";
import Anime from "./pages/Anime";
import MovieDetail from "./components/MovieDetail";
import TVShowDetail from "./components/TVShowDetail";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTopButton from "./components/ScrollToTopButton"; 

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 relative overflow-hidden">
        <div className="relative z-10">
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Home />
                </motion.div>
              }
            />

            {[
              { path: "/anime", element: <Anime /> },
              { path: "/anime/:id", element: <AnimeDetails /> },
              { path: "/manga", element: <Manga /> },
              { path: "/movies", element: <Movies /> },
              { path: "/movie/:id", element: <MovieDetail /> },
              { path: "/tvshows", element: <TvShows /> },
              {
                path: "/tv-show/:id/:season?/:episode?",
                element: <TVShowDetail />,
              },
            ].map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-screen"
                  >
                    {route.element}
                  </motion.div>
                }
              />
            ))}
          </Routes>
          <Footer />
          <ScrollToTopButton />
          <SpeedInsights />
          <Analytics />
        </div>
      </div>
    </Router>
  );
};

export default App;
