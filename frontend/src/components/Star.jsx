/* eslint-disable react/prop-types */
import { FaStar } from "react-icons/fa";

const Star = ({ filled, onClick }) => (
  <FaStar
    className={`cursor-pointer ${filled ? "text-yellow-500" : "text-gray-400"}`} // Change color based on filled state
    onClick={onClick}
    size={24} // Star size
  />
);

export default Star;
