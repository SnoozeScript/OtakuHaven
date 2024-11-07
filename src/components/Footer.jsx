import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-8">
          {/* Branding Section */}
          <div className="mb-6 md:mb-0 ">
            <p className="text-gray-400">
              © 2024 OtakuHaven.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Your portal to the world of anime, manga, and more!
            </p>
          </div>

          {/* Our Services Section */}
          <div className="mb-6 md:mb-0">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/anime"
                  className="text-gray-400 hover:text-white transition"
                >
                  Anime
                </a>
              </li>
              <li>
                <a
                  href="/manga"
                  className="text-gray-400 hover:text-white transition"
                >
                  Manga
                </a>
              </li>
              <li>
                <a
                  href="/movies"
                  className="text-gray-400 hover:text-white transition"
                >
                  Movies
                </a>
              </li>
              <li>
                <a
                  href="/tvshows"
                  className="text-gray-400 hover:text-white transition"
                >
                  TV Shows
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:aadilinamdar27@gmail.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  contact@otakuhaven.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919011156314"
                  className="text-gray-400 hover:text-white transition"
                >
                  +91 90111 56314
                </a>
              </li>
              <li>
                <p className="text-gray-400">
                  123 Otaku District: Anime, Manga, Movies & TV Shows, OC 12345
                </p>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-gray-400 hover:text-white transition"
                  size="lg"
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className="text-gray-400 hover:text-white transition"
                  size="lg"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-gray-400 hover:text-white transition"
                  size="lg"
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="text-gray-400 hover:text-white transition"
                  size="lg"
                />
              </a>
            </div>
          </div>
        </div>
        {/* Design & Developed By Fusion Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Open the door to anime, manga, movies, and TV shows – a project by{" "}
            <a
              href="https://github.com/4adil-27" // Replace with your actual GitHub link
              target="_blank" // Opens in a new tab
              rel="noopener noreferrer" // Security measure
              className="text-blue-500 hover:underline"
            >
              4adil-27
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
