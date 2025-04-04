import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEnvelope,
  faBell,
  faAngleDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import DropDown from "./sub/DropDown";
import Messenger from "./Messenger";
import NotificationBar from "./sub/NotificationBar";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const auth = useContext(AuthContext);
  if (!auth) return <div>Loading...</div>;
  const { user } = auth;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [isDropOpen, setDropOpen] = useState<boolean>(false);
  const [isMessengerOpen, setMessengerOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setNotificationOpen] = useState<boolean>(false);

  const handleMessengerOpen = () => {
    setMessengerOpen(!isMessengerOpen);
    setDropOpen(false);
    setSearchOpen(false);
    setNotificationOpen(false);
  };

  const handleNewNotificationsOpen = () => {
    setNotificationOpen(!isNotificationsOpen);
    setMessengerOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-900 p-4 shadow-md text-white sticky top-0 z-50">
      <div className="flex items-center">
        {/* Logo Image */}
        <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-md" />

        {/* Search Bar with Icon Inside */}
        <div className="relative flex-none mx-4 max-w-[200px] ">
          {screenWidth > 1000 ? (
            <>
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 pr-10 py-2 rounded-full bg-gray-100 outline-none transition focus:bg-white focus:border-gray-300 text-sm text-black font-normal"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              />
            </>
          ) : (
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => setSearchOpen(!isSearchOpen)}
              className="cursor-pointer text-xl"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      {screenWidth > 700 ? (
        <nav className="flex gap-6 justify-center "> {/* Added ml-10 to shift left */}
          <Link to="/">Home</Link>
          <Link to="#" className="hover:underline">Ride Request</Link>
          <Link to="#">Ride History</Link>
          <Link to="#" className="hover:underline">Complain</Link>
        </nav>
      ) : (
        <button className="text-xl" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}


      {/* Desktop Icons */}
      <div className="flex items-center gap-6">
        <FontAwesomeIcon
          icon={faEnvelope}
          onClick={handleMessengerOpen}
          className="cursor-pointer text-2xl transition-all duration-300 hover:text-gray-300 hover:scale-110"
        />
        {isMessengerOpen && <Messenger />}

        <FontAwesomeIcon
          icon={faBell}
          onClick={handleNewNotificationsOpen}
          className="cursor-pointer text-2xl transition-all duration-300 hover:text-gray-300 hover:scale-110"
        />
        {isNotificationsOpen && <NotificationBar />}

        <Link to={`/${user?.id}`} className="relative">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-r from-blue-800 to-blue-500 transition-all hover:scale-110">
            <img
              src={user?.profilePic}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-2 border-transparent hover:border-blue"
            />
          </div>
        </Link>

        <FontAwesomeIcon
          onClick={() => setDropOpen(!isDropOpen)}
          icon={faAngleDown}
          className="cursor-pointer text-2xl transition-all duration-300 hover:text-gray-300 hover:scale-110"
        />
      </div>
      {isDropOpen && <DropDown />}
    </header>
  );
};

export default Header;
