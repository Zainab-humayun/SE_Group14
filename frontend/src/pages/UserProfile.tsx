import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";
import { getRequest } from "../services/apiRequests";
import { Navigate } from "react-router-dom";
import ComplainForm from "../components/sub/ComplainForm";
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

interface Complaint {
  id: string;
  complain: string;
  createdAt: string;
  targetId: string;
}

interface Vehicle {
  name: string;
  model: string;
  numberPlate: string;
  color: string;
  vehiclePics?: string;
}

interface Profile {
  id: string;
  fullname: string;
  username: string;
  profilePic?: string;
  isAdmin: boolean;
  driver: boolean;
  isSuspended: boolean;
  rating?: number;
  reviews?: any[];
  complains?: Complaint[];
  phone?: string;
  gender?: string;
  vehicles?: Vehicle;
}

const UserProfile = () => {
  const { darkMode } = useTheme();
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showComplains, setShowComplaints] = useState<boolean>(false);
  const [showComplainForm, setShowComplainForm] = useState<boolean>(false);
  

  console.log("Profile: ", profile);

  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error(
      "AuthContext is undefined. Make sure you are using ProtectedRoute within an AuthProvider."
    );
    return;
  }
  const { accessToken } = auth;

  console.log("Auth User ID:", auth.user?.id);
  console.log("Profile ID:", profile?.id);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const userData = await getRequest(
          `/general/profile/${userId}`,
          accessToken,
          setLoading,
          setError
        );
        setProfile(userData);
      } catch (error) {
        setError("Failed to fetch user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  // Uber-inspired color scheme
  const bgColor = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-900";
  const secondaryText = darkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const coverBg = darkMode ? "bg-gray-800" : "bg-black";
  const buttonBg = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-black hover:bg-gray-800";
  const accentColor = "text-green-500"; // Uber's green accent color

  if (loading)
    return (
      <div className={`flex justify-center items-center h-screen ${bgColor}`}>
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500`}
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
          {/* Profile Header - Uber-style card */}
          <div
            className={`${cardBg} shadow-lg rounded-lg overflow-hidden border ${borderColor} transition-colors duration-300 mb-8`}
          >
            {/* Cover Photo - Uber black background */}
            <div className={`h-40 ${coverBg} relative`}>
              <div className="absolute -bottom-16 left-6">
                <div
                  className={`h-32 w-32 rounded-full border-4 ${cardBg} shadow-lg overflow-hidden`}
                >
                  <img
                    src={profile.profilePic || "/default-profile.png"}
                    alt={`${profile.fullname || "User"}'s Profile`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/default-profile.png";
                    }}
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
                      <h1 className={`text-2xl font-bold ${textColor}`}>
                        {profile.fullname}
                      </h1>
                      <p className={`${secondaryText} text-sm`}>
                        @{profile.username}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <Link
                        to={`/${userId}/update`}
                        className={`flex items-center px-4 py-2 rounded-lg ${buttonBg} text-white transition-all text-sm font-medium`}
                      >
                        <FiEdit className="mr-2" /> Edit
                      </Link>
                    </div>
                  </div>

                  {/* Badges - Uber-style simple indicators */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.isAdmin && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700 text-green-400" : "bg-gray-200 text-gray-800"}`}
                      >
                        <FiShield className="mr-1" /> Admin
                      </span>
                    )}
                    {profile.driver && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700 text-green-400" : "bg-gray-200 text-gray-800"}`}
                      >
                        <FaCar className="mr-1" /> Driver
                      </span>
                    )}
                    {profile.isSuspended && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}
                      >
                        <FiAlertCircle className="mr-1" /> Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats - Uber-style simple stats */}
            <div
              className={`border-t ${borderColor} ${darkMode ? "bg-gray-700" : "bg-gray-100"} px-4 sm:px-6 py-3`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
                {/* Rating */}
                <div className={`flex items-center ${secondaryText} text-sm`}>
                  <FiStar className={`${accentColor} mr-1`} />
                  <span className="font-medium">{profile.rating || "N/A"}</span>
                  <span className="ml-1">({profile.reviews?.length || 0})</span>
                </div>

                {/* Complaints */}
                <div
                  className={`flex items-center ${secondaryText} text-sm flex-wrap`}
                >
                  <FiMessageSquare
                    className={`${darkMode ? "text-blue-300" : "text-blue-500"} mr-1`}
                  />
                  <span className="flex items-center gap-1 flex-wrap">
                    {profile.complains?.length || 0} complaints
                    <button
                      onClick={() => setShowComplaints(true)}
                      className={`underline font-medium ${darkMode ? "text-blue-300" : "text-blue-600"} hover:text-blue-800 transition`}
                    >
                      View
                    </button>
                    {auth.user?.id &&
                      userId &&
                      auth.user.id !== userId && (
                        <button
                          onClick={() => setShowComplainForm(!showComplainForm)}
                          className="underline font-medium text-blue-500 hover:text-blue-700"
                        >
                          Add
                        </button>
                      )}
                  </span>
                </div>

                {/* Phone */}
                <div className={`flex items-center ${secondaryText} text-sm`}>
                  <FiPhone className={`${secondaryText} mr-1`} />
                  <span>{profile.phone || "No phone"}</span>
                </div>
              </div>
            </div>
          </div>

          {showComplainForm && profile && (
            <ComplainForm
              targetId={profile?.id}
              darkMode={darkMode}
              onClose={() => setShowComplainForm(false)}
            />
          )}

          {/* Complaints Modal */}
          {showComplains && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Background Blur */}
              <div
                className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
                onClick={() => setShowComplaints(false)}
              ></div>

              {/* Modal */}
              <div
                className={`relative z-10 ${cardBg} rounded-xl shadow-xl w-11/12 max-w-md p-6 max-h-[80vh] overflow-y-auto`}
              >
                <h2 className={`text-lg font-bold mb-4 ${textColor}`}>
                  Complaints
                </h2>
                <ul className="space-y-2">
                  {profile.complains && profile.complains.length > 0 ? (
                    profile.complains.map(
                      (complaint: Complaint, idx: number) => (
                        <li
                          key={idx}
                          className={`p-3 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"} ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                        >
                          <p>{complaint.complain}</p>
                          <p className={`text-xs mt-1 ${secondaryText}`}>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </p>
                        </li>
                      )
                    )
                  ) : (
                    <p className={`${secondaryText}`}>No complaints found.</p>
                  )}
                </ul>
                <button
                  onClick={() => setShowComplaints(false)}
                  className={`mt-4 px-4 py-2 ${buttonBg} text-white rounded transition`}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Details Section - Uber-style two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div
              className={`${cardBg} shadow-sm rounded-lg p-5 border ${borderColor} transition-colors duration-300`}
            >
              <h2
                className={`text-lg font-semibold ${textColor} mb-4 pb-2 border-b ${borderColor}`}
              >
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center mr-3`}
                  >
                    <FiUser className={`${secondaryText}`} />
                  </div>
                  <div>
                    <p className={`text-xs ${secondaryText}`}>Username</p>
                    <p className={`${textColor} font-medium`}>
                      @{profile.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center mr-3`}
                  >
                    <FiUser className={`${secondaryText}`} />
                  </div>
                  <div>
                    <p className={`text-xs ${secondaryText}`}>Full Name</p>
                    <p className={`${textColor} font-medium`}>
                      {profile.fullname}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center mr-3`}
                  >
                    <FiUser className={`${secondaryText}`} />
                  </div>
                  <div>
                    <p className={`text-xs ${secondaryText}`}>Gender</p>
                    <p className={`${textColor} font-medium capitalize`}>
                      {profile.gender || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center mr-3`}
                  >
                    <FiPhone className={`${secondaryText}`} />
                  </div>
                  <div>
                    <p className={`text-xs ${secondaryText}`}>Phone</p>
                    <p className={`${textColor} font-medium`}>
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info Card - Uber-style vehicle card */}
            {profile.driver && (
              <div
                className={`${cardBg} shadow-sm rounded-lg p-5 border ${borderColor} transition-colors duration-300`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b ${borderColor}">
                  <h2 className={`text-lg font-semibold ${textColor}`}>
                    Vehicle Information
                  </h2>
                  <Link
                    to="/update-vehicle-info"
                    className={`flex items-center px-3 py-1 rounded-lg ${buttonBg} text-white transition-all text-xs font-medium`}
                  >
                    <FiEdit className="mr-1" /> Edit
                  </Link>
                </div>

                {profile.vehicles ? (
                  <div className="space-y-4">
                    {/* Vehicle Image */}
                    {profile.vehicles.vehiclePics && (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                        <img
                          src={profile.vehicles.vehiclePics}
                          alt={`${profile.vehicles.name || "Vehicle"} photo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/default-vehicle.png";
                          }}
                        />
                      </div>
                    )}

                    {/* Vehicle Details - Uber-style compact info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className={`${secondaryText} text-xs`}>Make</p>
                        <p className={textColor}>
                          {profile.vehicles.name || "—"}
                        </p>
                      </div>
                      <div>
                        <p className={`${secondaryText} text-xs`}>Model</p>
                        <p className={textColor}>
                          {profile.vehicles.model || "—"}
                        </p>
                      </div>
                      <div>
                        <p className={`${secondaryText} text-xs`}>Plate</p>
                        <p className={textColor}>
                          {profile.vehicles.numberPlate || "Not registered"}
                        </p>
                      </div>
                      <div>
                        <p className={`${secondaryText} text-xs`}>Color</p>
                        <p className={textColor}>
                          {profile.vehicles.color || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`text-center py-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    <FiTruck
                      className={`mx-auto text-2xl mb-2 ${secondaryText}`}
                    />
                    <p className={`text-sm ${textColor} mb-1`}>
                      No vehicle registered
                    </p>
                    <Link
                      to="/update-vehicle-info"
                      className={`inline-flex items-center px-3 py-1 rounded-lg ${buttonBg} text-white transition-all text-xs font-medium mt-2`}
                    >
                      <FiPlus className="mr-1" /> Add Vehicle
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Uber-style action button at bottom */}
          {profile.driver && (
            <div className="mt-8 text-center">
              <button
                className={`px-6 py-3 rounded-lg ${accentColor} bg-black text-white font-medium hover:bg-gray-900 transition-colors`}
              >
                Go Online
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={`flex justify-center items-center h-screen ${bgColor}`}>
          <div
            className={`${cardBg} shadow-lg rounded-lg p-6 max-w-md text-center border ${borderColor}`}
          >
            <h2 className={`text-xl font-semibold ${textColor} mb-3`}>
              User not found
            </h2>
            <p className={secondaryText}>
              The user you're looking for doesn't exist or may have been
              deleted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
