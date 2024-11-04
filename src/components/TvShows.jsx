import { useState, useEffect } from "react";

const TvShows = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay to demonstrate loading spinner
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-purple-500 mb-4">Coming Soon</h1>
      <p className="text-gray-400 text-lg">
        Our TV shows section is currently under development.
      </p>
      <p className="text-gray-400 text-lg">
        Stay tuned for amazing content!
      </p>
    </div>
  );
};

export default TvShows;
