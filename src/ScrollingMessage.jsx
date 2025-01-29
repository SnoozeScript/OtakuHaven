import { motion } from "framer-motion";

function ScrollingMessage() {
  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden relative">
      <motion.div
        className="flex space-x-8 text-lg font-bold whitespace-nowrap"
        animate={{ x: [0, -800] }} // Adjust -500 or higher to change scroll length
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <span>
          {" "}
          If content aren&#39;t loading, use{" "}
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
