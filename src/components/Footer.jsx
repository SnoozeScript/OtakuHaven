import { motion } from "framer-motion";
import { Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  const footerItems = [
    {
      title: "Our Services",
      items: [
        { name: "Anime", href: "/anime" },
        { name: "Manga", href: "/manga" },
        { name: "Movies", href: "/movies" },
        { name: "TV Shows", href: "/tvshows" },
      ],
    },
    {
      title: "Contact Us",
      items: [
        {
          name: "contact@aadilinamdar27.me",
          href: "mailto:contact@aadilinamdar27.me",
        },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 border-t border-purple-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Branding Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              OtakuHaven
            </h3>
            <p className="text-gray-400 mb-2">
              © 2024 OtakuHaven. All rights reserved
            </p>
            <p className="text-sm text-gray-500">
              Your portal to the world of anime, manga, and more!
            </p>
          </motion.div>

          {/* Services & Contact Sections */}
          {footerItems.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <h4 className="text-lg font-semibold text-purple-400 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <motion.li
                    key={item.name}
                    whileHover={{ x: 5 }}
                    className="group"
                  >
                    <a
                      href={item.href}
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <span className="bg-gradient-to-r from-purple-600/20 to-transparent group-hover:from-purple-600/40 px-3 py-1.5 rounded-lg transition-all">
                        {item.name}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-purple-800/50 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex space-x-6 mb-4 md:mb-0">
            {[
              { icon: Github, link: "https://github.com/SnoozeScript" },
              { icon: Twitter, link: "https://twitter.com/snoozescript" },
              { icon: Instagram, link: "https://instagram.com/snoozescript" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="p-2 rounded-full bg-purple-900/30 hover:bg-purple-800/50 transition-all"
              >
                <social.icon className="h-5 w-5 text-purple-400 hover:text-white" />
              </motion.a>
            ))}
          </div>

          {/* Developer Credit */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-sm text-gray-400 hover:text-white"
          >
            Crafted by{" "}
            <a
              href="https://github.com/SnoozeScript"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold"
            >
              SnoozeScript 💤
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
