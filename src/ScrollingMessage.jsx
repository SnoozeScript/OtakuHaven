import { motion } from "framer-motion";

function ScrollingMessage() {
  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden relative">
      <motion.div
        className="flex space-x-8 text-lg font-bold whitespace-nowrap"
        animate={{ x: [0, -500] }} // Adjust -500 or higher to change scroll length
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <span>Anime, Manga, are being updated!</span>
        <span>Movies & TV Shows are available now</span>
        <span>
          {" "}
          If Movies/TV Shows aren't loading, use{" "}
          <a
            href="https://one.one.one.one"
            className="underline text-brown-400"
          >
            Cloudflare DNS
          </a>
        </span>
        <span>Anime, Manga, are being updated!</span>
        <span>Movies & TV Shows are available now</span>
        <span>
          {" "}
          If Movies/TV Shows aren't loading, use{" "}
          <a
            href="https://one.one.one.one"
            className="underline text-brown-400"
          >
            Cloudflare DNS
          </a>
        </span>
      </motion.div>
    </div>
  );
}

export default ScrollingMessage;
