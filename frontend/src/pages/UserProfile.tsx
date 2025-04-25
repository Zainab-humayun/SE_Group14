import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";
import { getRequest } from "../services/apiRequests";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiStar,
  FiPhone,
  FiUser,
  FiShield,
  FiAlertCircle,
  FiMessageSquare,
  FiPlus,
  FiTruck,
} from "react-icons/fi";
import { useTheme } from "../context/themeContext";
import { FaCar } from "react-icons/fa";
import RatingPopup from "../components/RatingPopup";

const UserProfile = () => {
  const { darkMode } = useTheme();
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "AuthContext is undefined. Make sure you are using ProtectedRoute within an AuthProvider."
    );
  }
  const user = authContext.user;
  const { accessToken } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const userData = await getRequest(
          `/general/profile/${userId}`,
          accessToken,
          setLoading,
          setError
        );
        setProfile(userData);
      } catch (error) {
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  console.log("Profile Data: ", profile);

  // Color variables for dark/light mode
  const bgColor = darkMode
    ? "bg-gray-900 text-gray-50"
    : "bg-white text-gray-900";

  const cardBg = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textColor = darkMode ? "text-gray-100" : "text-gray-900";

  const secondaryText = darkMode ? "text-gray-400" : "text-gray-600";

  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";

  // const buttonHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  const coverBg = darkMode
    ? "bg-gradient-to-r from-gray-800 to-gray-900"
    : "bg-gradient-to-r from-blue-500 to-indigo-600";

  // const accentColor = darkMode ? "text-blue-400" : "text-blue-600";

  const buttonBg = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-blue-100 hover:bg-blue-200";

  if (loading)
    return (
      <div className={`flex justify-center items-center h-screen ${bgColor}`}>
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-500"}`}
        ></div>
      </div>
    );

  if (error)
    return (
      <div className={`flex justify-center items-center h-screen ${bgColor}`}>
        <div
          className={`${cardBg} border ${borderColor} ${textColor} px-4 py-3 rounded-lg shadow-lg max-w-md`}
        >
          {error}
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${bgColor} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      {profile ? (
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div
            className={`${cardBg} shadow-xl rounded-xl overflow-hidden border ${borderColor} transition-colors duration-300`}
          >
            {/* Cover Photo */}
            <div className={`h-48 ${coverBg} relative`}>
              <div className="absolute -bottom-16 left-6">
                <div
                  className={`h-32 w-32 rounded-full border-4 ${darkMode ? "border-gray-800" : "border-white"} shadow-lg overflow-hidden`}
                >
                  <img
                    src={profile.profilePic || "/default-profile.png"}
                    alt={`${profile.fullname || "User"}'s Profile`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 pt-20 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between">
                    <div>
                      <h1 className={`text-3xl font-bold ${textColor}`}>
                        {profile.fullname}
                      </h1>
                      <p className={`${secondaryText} text-lg`}>
                        @{profile.username}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <Link
                        to={`/${userId}/update`}
                        className={`flex items-center px-4 py-2 rounded-lg ${buttonBg} ${textColor} transition-all`}
                      >
                        <FiEdit className="mr-2" /> Edit Profile
                      </Link>
                      <button
                        className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-red-400" : "bg-red-100 hover:bg-red-200 text-red-700"} transition-all`}
                      >
                        <FiTrash2 className="mr-2" /> Remove
                      </button>
                      {user?.id !== userId && (
                        <button
                          onClick={() => setIsRatingOpen(true)}
                          className={`flex items-center px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-all`}
                        >
                          <FiStar className="mr-2" /> Rate User
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.isAdmin && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800"}`}
                      >
                        <FiShield className="mr-2" /> Admin
                      </span>
                    )}
                    {profile.driver && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"}`}
                      >
                        <FaCar className="mr-2" /> Driver
                      </span>
                    )}
                    {profile.isSuspended && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}
                      >
                        <FiAlertCircle className="mr-2" /> Suspended
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`}
                    >
                      <FiUser className="mr-2" /> {profile.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`border-t ${borderColor} ${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4`}
            >
              <div className="flex flex-wrap justify-between">
                <div className={`flex items-center ${secondaryText}`}>
                  <FiStar
                    className={`${darkMode ? "text-yellow-300" : "text-yellow-500"} mr-2`}
                  />
                  <span className="font-medium">{profile.rating || 0}/5</span>
                  <span className="ml-1">
                    ({profile.reviews?.length || 0} reviews)
                  </span>
                </div>
                <div className={`flex items-center ${secondaryText}`}>
                  <FiMessageSquare
                    className={`${darkMode ? "text-blue-300" : "text-blue-500"} mr-2`}
                  />
                  <span>{profile.complains?.length || 0} complaints</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div
              className={`${cardBg} shadow-xl rounded-xl p-6 border ${borderColor} transition-colors duration-300`}
            >
              <h2
                className={`text-xl font-semibold ${textColor} mb-5 pb-2 border-b ${borderColor}`}
              >
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiUser className={`${secondaryText} mr-3 text-lg`} />
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Username</p>
                    <p className={`${textColor} font-medium`}>
                      @{profile.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className={`${secondaryText} mr-3 text-lg`} />
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Full Name</p>
                    <p className={`${textColor} font-medium`}>
                      {profile.fullname}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className={`${secondaryText} mr-3 text-lg`} />
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Gender</p>
                    <p className={`${textColor} font-medium capitalize`}>
                      {profile.gender || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiPhone className={`${secondaryText} mr-3 text-lg`} />
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Phone</p>
                    <p className={`${textColor} font-medium`}>
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info Card - Only shown if user is a driver */}
            <div
              className={`${cardBg} shadow-xl rounded-xl p-6 border ${borderColor} transition-colors duration-300`}
            >
              {/* Header with edit button */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b ${borderColor}">
                <h2 className={`text-2xl font-bold ${textColor}`}>
                  Vehicle Information
                </h2>
                <Link
                  to="/update-vehicle-info"
                  className={`flex items-center px-4 py-2 rounded-lg ${buttonBg} ${textColor} transition-all text-sm font-medium hover:opacity-90 hover:shadow-md`}
                >
                  <FiEdit className="mr-2" /> Update Vehicle
                </Link>
              </div>

              {profile.vehicles ? (
                <div className="space-y-6">
                  {/* Vehicle Image - Featured prominently */}
                  {profile.vehicles.vehiclePics && (
                    <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden border-2 ${borderColor}">
                      <img
                        src={profile.vehicles.vehiclePics}
                        alt={`${profile.vehicles.name || "Vehicle"} photo`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <p className={`text-white font-medium text-lg`}>
                          {profile.vehicles.name}
                        </p>
                        <p className={`text-gray-200 text-sm`}>
                          {profile.vehicles.model} • {profile.vehicles.color}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Details */}
                  <div
                    className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} shadow-sm`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className={`font-medium ${secondaryText}`}>
                          License Plate
                        </p>
                        <p className={`${textColor} font-semibold`}>
                          {profile.vehicles.numberPlate || "Not registered"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className={`font-medium ${secondaryText}`}>
                          Vehicle Type
                        </p>
                        <p className={textColor}>
                          {profile.vehicles.type || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className={`font-medium ${secondaryText}`}>
                          Model Year
                        </p>
                        <p className={textColor}>
                          {profile.vehicles.model || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className={`font-medium ${secondaryText}`}>Color</p>
                        <p className={textColor}>
                          {profile.vehicles.color || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`text-center py-8 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
                >
                  <FiTruck
                    className={`mx-auto text-3xl mb-3 ${secondaryText}`}
                  />
                  <p className={`text-lg ${textColor} mb-2`}>
                    No vehicle registered
                  </p>
                  <p className={`text-sm ${secondaryText} mb-4`}>
                    Add your vehicle to get started
                  </p>
                  <Link
                    to="/update-vehicle-info"
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${buttonBg} ${textColor} transition-all text-sm font-medium hover:opacity-90`}
                  >
                    <FiPlus className="mr-2" /> Add Vehicle
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
      ) : (
        <div className={`flex justify-center items-center h-screen ${bgColor}`}>
          <div
            className={`${cardBg} shadow-xl rounded-xl p-8 max-w-md text-center border ${borderColor}`}
          >
            <h2 className={`text-2xl font-semibold ${textColor} mb-3`}>
              User not found
            </h2>
            <p className={secondaryText}>
              The user you're looking for doesn't exist or may have been
              deleted.
            </p>
          </div>
        </div>
      )}
      {user?.id !== userId && isRatingOpen && (
        <RatingPopup userId={userId} onClose={() => setIsRatingOpen(false)} />
      )}

    </div>
  );
};

export default UserProfile;
