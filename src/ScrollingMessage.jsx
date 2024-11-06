import { motion } from "framer-motion";

function ScrollingMessage() {
  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden relative">
      <motion.div
        className="flex space-x-8 text-lg font-bold whitespace-nowrap"
        animate={{ x: [0, -500] }} // Adjust -500 or higher to change scroll length
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <span>
          Anime, Manga, are being updated! More awesomeness is coming your way
        </span>
        <span>TV Shows are available now</span>
        <span>
          Anime, Manga, are being updated! More awesomeness is coming your way
        </span>
        <span>TV Shows are available now</span>
      </motion.div>
    </div>
  );
}

export default ScrollingMessage;
