import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import { postRequest } from "../services/apiRequests";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

interface RatingPopupProps {
  userId: string | undefined;
  onClose: () => void;
}

const RatingPopup: React.FC<RatingPopupProps> = ({ userId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const auth = useContext(AuthContext);

  if(!auth) {
    return;
  }

  const url = "/general/rate-user";

  const handleSubmit = async () => {
    console.log(`Submitting rating: ${rating} for userId: ${userId}`);

    const response = await postRequest({rating, userId}, url, auth?.accessToken);

    console.log(response)
;
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">Rate This User</h2>

        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`text-2xl transition-transform ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <FiStar />
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Rating
        </button>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-600 block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RatingPopup;
