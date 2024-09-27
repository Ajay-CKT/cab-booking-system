import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = () => {
  const rating = 4; // Set the rating (4 filled stars)

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= rating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-500" />}</span>
      ))}
    </div>
  );
};

export default StarRating;
