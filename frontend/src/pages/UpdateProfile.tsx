import { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../context/authContext";
import { putRequest, getRequest } from "../services/apiRequests";
import { useTheme } from "../context/themeContext";
import { FiUser, FiPhone, FiSave, FiInfo, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface UserData {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  driver: "yes" | "no";
  type: "STUDENT" | "FACULTY";
}

const UpdateProfile = () => {
  const { darkMode } = useTheme();
  const auth = useContext(AuthContext);
  
  const [userData, setUserData] = useState<UserData>({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    driver: "no",
    type: "STUDENT"
  });
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.user?.id) return;
      
      setLoading(true);
      try {
        const data = await getRequest(
          `/general/profile/${auth.user.id}`,
          auth.accessToken,
          setLoading,
          setError
        );
        
        setUserData({
          username: data.username || "",
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          driver: data.driver === "yes" ? "yes" : "no",
          type: data.type === "FACULTY" ? "FACULTY" : "STUDENT"
        });
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth?.user?.id, auth?.accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDriverChange = (value: "yes" | "no") => {
    setUserData(prev => ({
      ...prev,
      driver: value
    }));
  };

  const handleTypeChange = (value: "STUDENT" | "FACULTY") => {
    setUserData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!auth?.user?.id) {
      setError("User not authenticated");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const updateData = {
        fullname: userData.fullname,
        phone: userData.phone,
        driver: userData.driver,
        type: userData.type
      };

      const response = await putRequest(
        updateData,
        `/update/update-user-info`
      );
      
      if (response) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          if (!auth?.user) return;
          
          if (userData.driver === "yes") {
            navigate(`/update-vehicle-info`);
          } else {
            navigate(`/profile/${auth.user.id}`);
          }
        }, 2000);
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? "bg-gray-900 text-gray-50" : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const inputBg = darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 placeholder-gray-400 text-white" : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800";
  const disabledInputBg = darkMode ? "bg-gray-600 border-gray-500 text-gray-300" : "bg-gray-100 border-gray-200 text-gray-500";
  const buttonBg = darkMode ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900" : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800";
  const radioSelected = darkMode ? "bg-blue-600 border-blue-600" : "bg-blue-500 border-blue-500";
  const radioUnselected = darkMode ? "border-gray-500" : "border-gray-300";

  if (!auth) {
    return null;
  }

  return (
    <div className={`min-h-screen ${bgColor} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto">
        <div className={`${cardBg} shadow-xl rounded-xl overflow-hidden border transition-colors duration-300`}>
          <div className={`px-6 py-6 ${darkMode ? "bg-gray-900" : "bg-blue-600"} border-b border-gray-700`}>
            <h1 className="text-2xl font-bold text-white">Update Profile Information</h1>
            <p className="text-gray-200 text-sm mt-1">Update your personal details</p>
          </div>

          {loading && !userData.username ? (
            <div className="flex justify-center items-center py-16">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-500"}`}></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    readOnly
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg cursor-not-allowed ${disabledInputBg}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="relative">
                      <FiInfo className={`${darkMode ? "text-gray-400" : "text-gray-500"} group-hover:text-blue-500`} />
                      <span className={`absolute hidden group-hover:block w-48 -left-48 -top-8 px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`}>
                        Contact admin to change username
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    readOnly
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg cursor-not-allowed ${disabledInputBg}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="relative">
                      <FiInfo className={`${darkMode ? "text-gray-400" : "text-gray-500"} group-hover:text-blue-500`} />
                      <span className={`absolute hidden group-hover:block w-48 -left-48 -top-8 px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`}>
                        Contact admin to change email
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  </div>
                  <input
                    type="text"
                    name="fullname"
                    value={userData.fullname}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${inputBg}`}
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${inputBg}`}
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  User Type: <span className="font-bold">{userData.type}</span>
                </label>
                <div className="flex space-x-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("STUDENT")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${userData.type === "STUDENT" ? radioSelected + " text-white" : radioUnselected + ` ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}`}
                  >
                    STUDENT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("FACULTY")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${userData.type === "FACULTY" ? radioSelected + " text-white" : radioUnselected + ` ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}`}
                  >
                    FACULTY
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Do you want to be a driver?
                </label>
                <div className="flex space-x-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDriverChange("yes")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${userData.driver === "yes" ? radioSelected + " text-white" : radioUnselected + ` ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDriverChange("no")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${userData.driver === "no" ? radioSelected + " text-white" : radioUnselected + ` ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}`}
                  >
                    No
                  </button>
                </div>
                {userData.driver === "yes" && (
                  <p className={`mt-2 text-sm ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                    After saving, you'll be redirected to provide vehicle information.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-white flex items-center justify-center ${buttonBg}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <>
                    <FiSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;