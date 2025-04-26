import { getRequest, postRequest } from "../services/apiRequests";
import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";
import {
  FaCar,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const RidePosts = () => {
  const auth = useContext(AuthContext);
  const { darkMode } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notification] = useState("You got a ride request!");

  const navigate = useNavigate();



  const styles = useMemo(
    () => ({
      container: darkMode
        ? "bg-gray-900 text-gray-100 border-gray-700"
        : "bg-white text-gray-900 border-gray-200",
      card: darkMode
        ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/30"
        : "bg-white border-gray-200 hover:shadow-lg hover:shadow-blue-100",
      text: darkMode ? "text-gray-100" : "text-gray-800",
      secondaryText: darkMode ? "text-gray-400" : "text-gray-600",
      button: (isAccepted: boolean) =>
        isAccepted
          ? "bg-gray-500 text-white cursor-not-allowed"
          : darkMode
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white",
      statusIndicator: (isAccepted: boolean) =>
        isAccepted
          ? "bg-green-500 border-2 border-white"
          : "bg-yellow-500 border-2 border-white",
    }),
    [darkMode]
  );

  const fetchRidePosts = useCallback(async () => {
    if (!auth?.accessToken) return;
    const url = "/rides/ride-requests";

    setLoading(true);
    setError(null);
    try {
      const response = await getRequest(
        url,
        auth.accessToken,
        setLoading,
        setError
      );

      const postsWithCoords = response.map((post: any) => ({
        ...post,
        pickLocationCoords: post.pickLocationCoords || [0, 0],
        dropLocationCoords: post.dropLocationCoords || [0, 0],
      }));

      setPosts(postsWithCoords || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [auth?.accessToken]);

  const handleAccept = useCallback(
    async (postId: string, posterId: string) => {
      if (!auth?.accessToken) return;

      const acceptUrl = "/rides/accept-request";

      setError(null);
      try {
        const response = await postRequest(
          { id: postId },
          acceptUrl,
          auth.accessToken
        );

        if (response) {
          setSuccessMessage("Ride request accepted successfully!");
          setTimeout(() => setSuccessMessage(null), 3000);
          fetchRidePosts();
          setTimeout(() => {
            navigate("/ride/" + postId);
          }, 500);
        }
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError(err instanceof Error ? err.message : "Failed to accept ride");
        }
      }
    },
    [auth?.accessToken, fetchRidePosts, navigate]
  );

  useEffect(() => {
    fetchRidePosts();
  }, [fetchRidePosts]);

  if (!auth) {
    return (
      <div
        className={`text-center p-8 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        Please login to view ride posts
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 ${darkMode ? "border-blue-400" : "border-blue-500"}`}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`text-center p-8 ${darkMode ? "text-red-400" : "text-red-500"}`}
      >
        <p>Error: {error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchRidePosts();
          }}
          className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
        >
          Retry
        </button>
      </div>
    );
  }


  // useEffect(() => {

  // }, []);

  return (
    <div
      className={`max-w-3xl mx-auto p-0 md:p-4 rounded-xl ${styles.container}`}
    >
      <h3
        className={`text-2xl font-bold mb-6 text-center ${styles.text} flex items-center justify-center gap-2`}
      >
        <FaCar className="text-blue-500" />
        Available Ride Requests
      </h3>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-4 p-3 rounded-lg text-center font-medium ${
            darkMode
              ? "bg-green-900/50 text-green-300"
              : "bg-green-100 text-green-800"
          }`}
        >
          {successMessage}
        </motion.div>
      )}

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-5 border transition-all ${styles.card}`}
            >
              <div className="flex flex-col space-y-4">
                <Link
                  to={`/user/${post.poster.id}`}
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                  <div className="relative">
                    <img
                      src={post.poster.profilePic || "/default-avatar.png"}
                      alt={post.poster.username}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${styles.statusIndicator(post.isAccepted)}`}
                    ></span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`}>
                      {post.poster.username}
                    </span>
                    <small
                      className={`block text-sm ${styles.secondaryText} flex items-center gap-1`}
                    >
                      <FaClock className="text-xs" />
                      {new Date(post.time).toLocaleString()}
                    </small>
                  </div>
                </Link>
                <hr />

                <div className={`space-y-6 ${styles.text}`}>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt
                          className={`mt-1 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Pickup
                          </p>
                          <p className="text-sm">{post.pickLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt
                          className={`mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Dropoff
                          </p>
                          <p className="text-sm">{post.dropLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr
                    className={`${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <FaClock
                        className={`${darkMode ? "text-yellow-400" : "text-yellow-500"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Time
                        </p>
                        <p className="text-sm">
                          {new Date(post.departureTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave
                        className={`${darkMode ? "text-green-400" : "text-green-500"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Fare
                        </p>
                        <p className="text-sm">
                          Rs. {post.cost.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUsers
                        className={`${darkMode ? "text-purple-400" : "text-purple-500"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Passengers
                        </p>
                        <p className="text-sm">{post.seets || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaCar
                        className={`${darkMode ? "text-purple-400" : "text-purple-500"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Vehicle
                        </p>
                        <p className="text-sm">{post.vehicleType || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAccept(post.id, post.poster.id)}
                    className={`w-[30%] py-2.5 mt-2 rounded-3xl font-medium transition-all ${
                      post.isAccepted
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } flex items-center justify-center gap-2`}
                    disabled={post.isAccepted}
                  >
                    {post.isAccepted ? (
                      <>
                        <IoCheckmarkDoneCircle className="text-lg" />
                        Accepted
                      </>
                    ) : (
                      "Accept Ride"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} ${styles.secondaryText}`}
        >
          <FaCar className="mx-auto text-4xl mb-3 opacity-50" />
          <p className="text-lg font-medium">No ride requests available</p>
          <p className="mt-1 text-sm">
            Check back later or create your own ride post!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RidePosts;