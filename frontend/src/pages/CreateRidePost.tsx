import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { postRequest } from "../services/apiRequests";
import { FaExchangeAlt } from "react-icons/fa";

interface Location {
  place_id: string;
  display_name: string;
}

const CreateRidePost = () => {
  const [toQuery, setToQuery] = useState("");
  const [fromQuery, setFromQuery] = useState("");
  const [date, setDate] = useState("Today");
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  if (!auth) return null;

  const handlePostClick = async (e: any) => {
    e.preventDefault();
    const postData = {
      pickLocation: fromQuery,
      dropLocation: toQuery,
      date,
      passengers,
      poster: auth.user?.id,
    };
    await postRequest(postData, "/rides/send-request", auth.accessToken, setLoading, setError);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Blue Header */}
        <div className="bg-blue-400 p-6 text-white text-lg font-semibold">
          Where are you going?
        </div>

        {/* Blue Background for From and To Inputs */}
        <div className="bg-blue-400 p-6">
          {/* From Input */}
          <div className="flex items-center mb-4 ml-2">
            {/* From Input */}
            <div className="flex-1">
              <label className="text-sm text-white block mb-1">From</label>
              <div className="relative flex items-center pb-2">
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white"
                />
              </div>
              <div className="w-1/2 border-b border-white/50"></div> {/* Shorter, Transparent, Aligned Left */}
            </div>
  
            {/* Image on the right */}
            <div className="ml-4 flex-shrink-0">
              <img src="destination.gif" alt="From destination" className="w-28 h-28" /> {/* Bigger image */}
            </div>
          </div>

          {/* To Input */}
          <div className="flex items-center mb-4 ml-2">
            {/* To Input */}
            <div className="flex-1">
              <label className="text-sm text-white block mb-1">To</label>
              <div className="relative flex items-center pb-2">
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white"
                />
              </div>
              <div className="w-1/2 border-b border-white/50"></div> {/* Shorter, Transparent, Aligned Left */}
            </div>

            {/* Image on the right */}
            <div className="ml-4 flex-shrink-0">
              {/* If you want to add another GIF for the "To" field, uncomment the below line */}
              {/* <img src="path/to/your/image.gif" alt="To destination" className="w-12 h-12" /> */}
            </div>
          </div>
        </div>

        {/* White Background for Other Sections */}
        <div className="p-6 bg-white">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Date</label>
            <div className="flex space-x-3">
              {["Today", "Tomorrow", "Other Date"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`px-3 py-2 rounded-lg ${
                    date === d ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Passengers</label>
            <div className="flex space-x-3">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setPassengers(num)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    passengers === num ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePostClick}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Posting..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRidePost;
