import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { getRequest, postRequest, putRequest } from "../services/apiRequests";
import {
  FiClock,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiX,
  FiEdit2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { FaCarSide, FaUserAlt } from "react-icons/fa";
import { useTheme } from "../context/themeContext";

const CurrentActiveRide = () => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ride, setRide] = useState<any>(null);

  const { darkMode } = useTheme();

  if (!auth) {
    return null;
  }

  const handleCancelRide = async (rideId: string) => {
    const url = "/rides/cancel-ride";
    const res = await postRequest(
      { id: rideId },
      url,
      auth.accessToken,
      setLoading,
      setError
    );

    if (res) {
      setRide(null);
      setMessage(res.message);
    }
  };

  useEffect(() => {
    const fetchRide = async () => {
      const url = "/rides/active-ride";
      const response = await getRequest(
        url,
        auth.accessToken,
        setLoading,
        setError
      );
      if (response) {
        setRide(response);
      }
    };
    fetchRide();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg mb-4 ${darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-700"}`}
      >
        {error}
      </div>
    );
  }

  if (!ride) {
    return (
      <div
        className={`p-6 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-gray-50"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div
          className={`text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          <FaCarSide className="mx-auto text-3xl mb-3 text-blue-500" />
          <h3 className="text-xl font-semibold mb-1">No active rides</h3>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            You don't have any active ride requests at the moment.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeUntilRide = (dateString: string) => {
    const now = new Date();
    const rideTime = new Date(dateString);
    const diffMs = rideTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 0) {
      return "Departed";
    } else if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min`;
    } else if (diffHours < 24) {
      return `${diffHours} hr`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  };

  const otherUser =
    ride.poster.id === auth.user?.id ? ride.otherUser : ride.poster;
  const isDriver = auth.user?.driver;
  const rideStatus = ride.isAccepted ? "accepted" : "pending";

  const handleFareIncrease = async () => {
    if (!ride) return;

    let updatedFare = ride.cost + 5;

    const updatedRide = { ...ride, cost: updatedFare };
    setRide(updatedRide);

    const url = `/update/${ride.id}/update-fare`;

    const res = await putRequest({ fare: updatedFare }, url);

    console.log("Fare updated: ", res);
  };

  const handleFareDecrease = async () => {
    if (!ride) return;

    let updatedFare = ride.cost - 5;

    if (updatedFare >= 50) {
      const updatedRide = { ...ride, cost: updatedFare };
      setRide(updatedRide);

      const url = `/update/${ride.id}/update-fare`;

      const res = await putRequest({ fare: updatedFare }, url);

      console.log("Fare updated: ", res);
    }
  };

  return (
    <>
      <style>{`
        /* Modern scrollbar styling */
        .scroll-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        /* Light mode scrollbar */
        .scroll-container::-webkit-scrollbar-track {
          background: ${darkMode ? "#2D3748" : "#F1F1F1"};
          border-radius: 10px;
        }
        
        .scroll-container::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#4A5568" : "#CBD5E0"};
          border-radius: 10px;
          border: 2px solid ${darkMode ? "#2D3748" : "#F1F1F1"};
        }
        
        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "#718096" : "#A0AEC0"};
        }
        
        /* For Firefox */
        .scroll-container {
          scrollbar-width: thin;
          scrollbar-color: ${darkMode ? "#4A5568 #2D3748" : "#CBD5E0 #F1F1F1"};
        }
      `}</style>

      <div
        className={`flex flex-col h-full ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        {/* Status Bar */}
        <div
          className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${rideStatus === "accepted" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"} ${darkMode ? "dark:bg-opacity-20" : ""}`}
              >
                {rideStatus === "accepted" ? (
                  <FiCheckCircle size={20} />
                ) : (
                  <FiAlertCircle size={20} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {rideStatus === "accepted"
                    ? isDriver
                      ? "Passenger found"
                      : "Driver found"
                    : isDriver
                      ? "Looking for passengers"
                      : "Looking for drivers"}
                </h3>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {rideStatus === "accepted"
                    ? `Your ride is confirmed with ${otherUser?.fullname || "user"}`
                    : "Waiting for a match..."}
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${rideStatus === "accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} ${darkMode ? "dark:bg-opacity-20" : ""}`}
            >
              {rideStatus === "accepted" ? "Confirmed" : "Pending"}
            </div>
          </div>
        </div>

        {/* Ride Details with custom scrollbar */}
        <div
          className={`flex-1 overflow-y-auto p-4 scroll-container ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          {/* Time Until Ride */}
          <div
            className={`mb-4 p-3 rounded-lg flex items-center justify-between ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
          >
            <div>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Departing in
              </p>
              <p className="text-2xl font-bold">
                {getTimeUntilRide(ride.departureTime)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {formatDate(ride.departureTime)}
              </p>
              <p className="font-medium">{formatTime(ride.departureTime)}</p>
            </div>
          </div>

          {/* Route */}
          <div
            className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <div
                  className={`w-0.5 h-8 ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
                ></div>
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <div
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {ride.pickLocation}
                  </div>
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Pickup location
                  </div>
                </div>
                <div>
                  <div
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {ride.dropLocation}
                  </div>
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Dropoff location
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Info */}
          <div
            className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
          >
            <div
              className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`font-semibold text-base ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  Ride Details
                </h4>
                {!ride.isAccepted && <div className="flex gap-2">
                 
                 <button
                   onClick={handleFareIncrease}
                   title="Increase Fare"
                   className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                 >
                   + Fare
                 </button>
                 <button
                   onClick={handleFareDecrease}
                   title="Decrease Fare"
                   className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                 >
                   - Fare
                 </button>
               </div>}
                
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <FiUser
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Seats
                  </p>
                  <p
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {ride.seats}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <FiDollarSign
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Cost
                  </p>
                  <p
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    Rs. {ride.cost}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <FiCalendar
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Date
                  </p>
                  <p
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {formatDate(ride.departureTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <FiClock
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Time
                  </p>
                  <p
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {formatTime(ride.departureTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          {ride.isAccepted && otherUser && (
            <div
              className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
            >
              <h4
                className={`font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {isDriver ? "Passenger" : "Driver"} Details
              </h4>

              <div className="flex items-center gap-3">
                <div className="relative">
                  {otherUser.profilePic ? (
                    <img
                      src={otherUser.profilePic}
                      alt={otherUser.fullname}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${isDriver ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                    >
                      <FaUserAlt size={18} />
                    </div>
                  )}
                  {otherUser.driver && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                      <FaCarSide size={12} />
                    </div>
                  )}
                </div>

                <div>
                  <p
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {otherUser.fullname || "Unknown"}
                  </p>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    @{otherUser.username || "unknown"}
                  </p>
                  {otherUser.driver && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Verified driver
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`p-4 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex gap-3">
            {!ride.isAccepted && (
              <button
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
              >
                <FiEdit2 size={18} />
                Edit
              </button>
            )}
            <button
              onClick={() => handleCancelRide(ride.id)}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
            >
              <FiX size={18} />
              Cancel Ride
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentActiveRide;
