import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Film, Tv } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background texture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')]"
      />

      <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center relative z-10">
        {/* Animated Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {Array.from("OtakuHaven").map((char, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 150,
              }}
              className="inline-block hover:text-purple-200 transition-colors"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Description Section */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-gray-100 mb-12 text-center max-w-3xl leading-relaxed"
        >
          <Sparkles className="h-6 w-6 text-yellow-400 inline-block mr-2 mb-1" />
          Your gateway to endless anime & manga adventures. Free access, no
          sign-ups, Start exploring now!
        </motion.p>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
          {[
            {
              title: "Anime",
              to: "/anime",
              gradient: "from-purple-600 to-indigo-700",
              icon: Film,
              buttonText: "Explore Anime",
            },
            {
              title: "Manga",
              to: "/manga",
              gradient: "from-rose-600 to-red-700",
              icon: BookOpen,
              buttonText: "Read Manga",
            },
            {
              title: "Movies",
              to: "/movies",
              gradient: "from-emerald-600 to-teal-700",
              icon: Film,
              buttonText: "Watch Movies",
            },
            {
              title: "TV Shows",
              to: "/tvshows",
              gradient: "from-blue-600 to-violet-700",
              icon: Tv,
              buttonText: "Browse Shows",
            },
          ].map((section) => (
            <Link
              key={section.title}
              to={section.to}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:z-10"
            >
              <motion.div
                className={`bg-gradient-to-br ${section.gradient} p-8 h-full`}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col h-full">
                  <section.icon className="h-12 w-12 text-white/80 mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-200 mb-6 flex-1">
                    {section.title === "Anime" &&
                      "Discover both timeless classics and trending new series in stunning HD."}
                    {section.title === "Manga" &&
                      "Immerse yourself in beautifully illustrated stories from top creators."}
                    {section.title === "Movies" &&
                      "Experience cinematic masterpieces with premium quality streaming."}
                    {section.title === "TV Shows" &&
                      "Binge-watch complete seasons with multi-language subtitles."}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-fit bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    {section.buttonText}
                  </motion.div>
                </div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-sm mt-12 text-center"
        >
          No accounts required • Free forever • Made with ❤️
        </motion.p>
      </div>
    </div>
  );
};

export default Home;
