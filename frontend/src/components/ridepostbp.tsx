// import { getRequest, postRequest } from "../services/apiRequests";
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/authContext";
// import { Link } from "react-router-dom";
// import { useTheme } from "../context/themeContext";
// // import { FaLocationDot } from "react-icons/fa6";
// // import { IoLocationOutline } from "react-icons/io5";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
// // import { faLocationDot as faLocationDotLight } from "@fortawesome/pro-light-svg-icons"; // Importing the light version

// import { IoLocationOutline } from "react-icons/io5"; // Import from react-icons
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faClock, faCar, faMoneyBillWave, faUsers,  faStar, faStarHalfAlt} from '@fortawesome/free-solid-svg-icons';

// const RidePosts = () => {
//   const auth = useContext(AuthContext);
//   const { darkMode } = useTheme(); 
//   if (!auth) return null;

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<null | string>(null);
//   const [posts, setPosts] = useState<any[] | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const url = "/rides/ride-requests";
//   const postUrl = "/rides/accept-request";

//   useEffect(() => {
//     const fetchRidePosts = async () => {
//       setLoading(true);
//       setError(null);

//       const response = await getRequest(url, auth.accessToken, setLoading, setError);

//       if (response) {
//         setPosts(response);
//       }
//     };

//     fetchRidePosts();
//   }, [auth.accessToken]);

//   const handleAccept = async (postId: string) => {
//     const response = await postRequest({ id: postId }, postUrl, auth.accessToken, setLoading, setError);

//     if (response) {
//       setSuccessMessage("Ride accepted successfully!");
//       setTimeout(() => setSuccessMessage(null), 3000);

//       setPosts((prevPosts) =>
//         prevPosts ? prevPosts.map((post) => (post.id === postId ? { ...post, isAccepted: true } : post)) : null
//       );
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg border bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 border-gray-300 font-montserrat">
//   <h3 className="text-2xl font-semibold mb-6 text-center">Ride Requests</h3>

//   {loading && <p className="text-blue-500 text-center">Loading...</p>}
//   {error && <p className="text-red-500 text-center">Error: {error}</p>}
//   {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

//   {posts && posts.length > 0 ? (
//     <div className="space-y-6">
//       {posts.map((post) => (
//         <div
//           key={post.id}
//           className="shadow-md rounded-lg p-5 border flex flex-col gap-5 bg-white"
//         >
//            {/* User Info */}
//            <div className="flex items-center gap-4">
//             <img
//               src={post.poster.profilePic}
//               alt={post.poster.username}
//               className="w-14 h-14 rounded-full border border-gray-400"
//             />
//             <div className="flex-1">
//               <span className="font-semibold text-lg">{post.poster.username}</span>
//               {/* Rating Section */}
//               <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
//                 <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-base" />
//                 <span className="text-black font-semibold">
//                   {(post.rating ?? 4.83).toFixed(2)}
//                 </span>
//                 <span className="text-gray-500 text-xs">
//                   ({post.totalRatings ?? 3} reviews)
//                 </span>
//               </div>

//             </div>
//           </div>

//           {/* Pickup & Drop Section */}
//           <div className="flex gap-4 items-start">
//           {/* Location Icons */}
//           <div className="flex flex-col items-center">
//           <FontAwesomeIcon icon={faLocationDot} style={{ color: '#3459c4' }} className="text-lg" />

//             {/* Vertical spacing between the first location icon and dots */}
//             <div className="my-3">
//               <div className="h-1 w-1 bg-blue-700 rounded-full mb-2"></div>
//               <div className="h-1 w-1 bg-blue-700 rounded-full mb-2"></div>
//               <div className="h-1 w-1 bg-blue-700 rounded-full"></div>
//             </div>
//             <FontAwesomeIcon icon={faLocationDot} className="text-blue-700 text-lg opacity-60" />
//           </div>

//          {/* Locations */}
//           <div className="space-y-2">
//             <p className="text-sm">
//               <strong className="text-[#3459c4]">Pickup:</strong> {post.pickLocation}
//             </p>
//             <p className="text-sm">
//               <strong className="text-[#3459c4]">Drop:</strong> {post.dropLocation}
//             </p>
//           </div>

//         </div>
//           {/* Ride Details Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             {/* Time Section */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faClock} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Time:</strong>
//               <p>{new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//             </div>

//             {/* Car Section */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faCar} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Car:</strong>
//               <p>{post.carModel || "Honda City"}</p>
//             </div>

//             {/* Seats Section */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faUsers} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Seats:</strong>
//               <p>{post.availableSeats ?? 1}</p>
//               {/* <p>{(post.availableSeats ?? 1)}/{post.totalSeats}</p> */}
//             </div>

//             {/* Fare Section (Renamed from Pay) */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Fare:</strong>
//               <p>Rs. {post.cost}</p>
//             </div>
//           </div>

//           {/* Request Button */}
//           <button
//             onClick={() => handleAccept(post.id)}
//             className={`w-full py-2 rounded-lg font-semibold text-white text-center transition-all ${
//               post.isAccepted ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={post.isAccepted}
//           >
//             {post.isAccepted ? "Not Available" : "Request a Ride"}
//           </button>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p className="text-center text-gray-500">No ride requests available.</p>
//   )}
// </div>
//   );
// };

// export default RidePosts;















///


// import { getRequest, postRequest } from "../services/apiRequests";
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/authContext";
// import { Link } from "react-router-dom";
// import { useTheme } from "../context/themeContext";
// // import { FaLocationDot } from "react-icons/fa6";
// // import { IoLocationOutline } from "react-icons/io5";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
// // import { faLocationDot as faLocationDotLight } from "@fortawesome/pro-light-svg-icons"; // Importing the light version

// import { IoLocationOutline } from "react-icons/io5"; // Import from react-icons
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faClock, faCar, faMoneyBillWave, faUsers,  faStar, faStarHalfAlt} from '@fortawesome/free-solid-svg-icons';
// import Map from "../components/sub/Map"; // Adjust based on your relative file structure


// const RidePosts = () => {
//   const auth = useContext(AuthContext);
//   const { darkMode } = useTheme(); 
//   if (!auth) return null;

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<null | string>(null);
//   const [posts, setPosts] = useState<any[] | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const url = "/rides/ride-requests";
//   const postUrl = "/rides/accept-request";

//   useEffect(() => {
//     const fetchRidePosts = async () => {
//       setLoading(true);
//       setError(null);

//       const response = await getRequest(url, auth.accessToken, setLoading, setError);

//       if (response) {
//         setPosts(response);
//       }
//     };

//     fetchRidePosts();
//   }, [auth.accessToken]);

//   const handleAccept = async (postId: string) => {
//     const response = await postRequest({ id: postId }, postUrl, auth.accessToken, setLoading, setError);

//     if (response) {
//       setSuccessMessage("Ride accepted successfully!");
//       setTimeout(() => setSuccessMessage(null), 3000);

//       setPosts((prevPosts) =>
//         prevPosts ? prevPosts.map((post) => (post.id === postId ? { ...post, isAccepted: true } : post)) : null
//       );
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg border bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 border-gray-300 font-montserrat">
//   <h3 className="text-2xl font-semibold mb-6 text-center">Ride Requests</h3>

//   {loading && <p className="text-blue-500 text-center">Loading...</p>}
//   {error && <p className="text-red-500 text-center">Error: {error}</p>}
//   {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

//   {posts && posts.length > 0 ? (
//     <div className="space-y-6">
//       {posts.map((post) => (
//         <div
//           key={post.id}
//           className="shadow-md rounded-lg p-5 border flex flex-col gap-5 bg-white"
//         >
//            {/* User Info */}
//            <div className="flex items-center gap-4">
//             <img
//               src={post.poster.profilePic}
//               alt={post.poster.username}
//               className="w-14 h-14 rounded-full border border-gray-400"
//             />
//             <div className="flex-1">
//               <span className="font-semibold text-lg">{post.poster.username}</span>
//               {/* Rating Section */}
//               <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
//                 <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-base" />
//                 <span className="text-black font-semibold">
//                   {(post.rating ?? 4.83).toFixed(2)}
//                 </span>
//                 <span className="text-gray-500 text-xs">
//                   ({post.totalRatings ?? 3} reviews)
//                 </span>
//               </div>

//             </div>
//           </div>

//           {/* Pickup & Drop Section */}
//           <div className="flex gap-4 items-start">
//           {/* Location Icons */}
//           <div className="flex flex-col items-center">
//           <FontAwesomeIcon icon={faLocationDot} style={{ color: '#3459c4' }} className="text-lg" />

//             {/* Vertical spacing between the first location icon and dots */}
//             <div className="my-3">
//               <div className="h-1 w-1 bg-blue-700 rounded-full mb-2"></div>
//               <div className="h-1 w-1 bg-blue-700 rounded-full mb-2"></div>
//               <div className="h-1 w-1 bg-blue-700 rounded-full"></div>
//             </div>
//             <FontAwesomeIcon icon={faLocationDot} className="text-blue-700 text-lg opacity-60" />
//           </div>

//          {/* Locations */}
//           <div className="space-y-2">
//             <p className="text-sm">
//               <strong className="text-[#3459c4]">Pickup:</strong> {post.pickLocation}
//             </p>
//             <p className="text-sm">
//               <strong className="text-[#3459c4]">Drop:</strong> {post.dropLocation}
//             </p>
//           </div>

//            {/* Map for Pickup Location */}
//            {posts?.map((post) => (
//   <div key={post.id} className="ride-post">
//     <h2>{post.name}</h2>
//     <p>Pickup: {post.pickLocation}</p>
//     <div className="flex-1 h-40 w-full">
//       {post.pickLatitude && post.pickLongitude ? (
//         <Map center={[post.pickLatitude, post.pickLongitude] as L.LatLngExpression} />
//       ) : (
//         <p className="text-sm text-gray-500">Location not available</p>
//       )}
//     </div>
//   </div>
// ))}




//         </div>
//           {/* Ride Details Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             {/* Time Section */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faClock} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Time:</strong>
//               <p>{new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//             </div>

//             {/* Car Section */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faCar} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Car:</strong>
//               <p>{post.carModel || "Honda City"}</p>
//             </div>

//             {/* Seats Section */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faUsers} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Seats:</strong>
//               <p>{post.availableSeats ?? 1}</p>
//               {/* <p>{(post.availableSeats ?? 1)}/{post.totalSeats}</p> */}
//             </div>

//             {/* Fare Section  */}
//             <div className="flex flex-col items-center">
//               <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1 text-[#3459c4]" />
//               <strong className="text-[#3459c4] text-sm">Fare:</strong>
//               <p>Rs. {post.cost}</p>
//             </div>
//           </div>

//           {/* Request Button */}
//           <button
//             onClick={() => handleAccept(post.id)}
//             className={`w-full py-2 rounded-lg font-semibold text-white text-center transition-all ${
//               post.isAccepted ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={post.isAccepted}
//           >
//             {post.isAccepted ? "Not Available" : "Request a Ride"}
//           </button>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p className="text-center text-gray-500">No ride requests available.</p>
//   )}
// </div>
//   );
// };

// export default RidePosts;
