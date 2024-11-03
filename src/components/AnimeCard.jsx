import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AnimeCard = ({ id, title, image, description, rating }) => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      <Link to={`/anime/${id}/1`} className="text-decoration-none text-dark"> {/* Link to the AnimeDetail page */}
        <img src={image} alt={title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          {rating && <p className="card-text"><strong>Rating:</strong> {rating}</p>} {/* Optional rating */}
        </div>
      </Link>
    </div>
  );
};

// PropTypes validation
AnimeCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string,
  rating: PropTypes.string, // Optional rating prop
};

export default AnimeCard;
