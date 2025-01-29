import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        className={`${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } transform transition-all duration-300 ease-in-out 
        bg-gradient-to-br from-purple-600 to-indigo-700
        hover:from-purple-700 hover:to-indigo-800 
        p-3 rounded-full shadow-lg hover:shadow-xl
        border border-white/10 hover:border-white/20
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 text-white stroke-[3]" />
        <span className="sr-only">Back to top</span>
      </button>
    </div>
  );
};

export default ScrollToTopButton;