import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEnvelope,
  faAngleDown,
  faSearch,
  faCommentDots,
  faHome,
  faCar,
  faFire,
  faHistory,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import SearchBarSmall from "./sub/SearchBarSmall";
import SearchBarDesktop from "./sub/SearchResult";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import DropDown from "./sub/DropDown";
import Messenger from "./Messenger";
import NotificationBar from "./sub/NotificationBar";
import { useTheme } from "../context/themeContext";
import { GeneralContext } from "../context/generalContext";
import { putRequest } from "../services/apiRequests";
import blueImage from "../static/blue.png";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { darkMode, toggleTheme } = useTheme();

  const auth = useContext(AuthContext);
  if (!auth) return <div>Loading...</div>;
  const { user } = auth;

  const generalContext = useContext(GeneralContext);
  if (!generalContext) {
    return;
  }

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

  const readNotifications = async () => {
    const response = await putRequest({}, "/notifications/update");
    generalContext.setUnreadNotificationCount(0);
  };

  const handleNewNotificationsOpen = () => {
    readNotifications();
    setNotificationOpen(!isNotificationsOpen);
    setMessengerOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
  };

  const headerBg = darkMode
    ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"
    : "bg-white shadow-sm border-b border-gray-100";

  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const hoverTextColor = darkMode
    ? "hover:text-blue-500"
    : "hover:text-blue-600";

  const iconColor = darkMode ? "text-gray-300" : "text-gray-600";
  const hoverIconColor = darkMode
    ? "hover:text-yellow-300"
    : "hover:text-blue-500";

  const mobileMenuBg = darkMode ? "bg-gray-800" : "bg-white";
  const mobileMenuText = darkMode ? "text-gray-100" : "text-gray-800";

  const searchInputBg = darkMode
    ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:ring-2 focus:ring-indigo-500"
    : "bg-gray-50 border-gray-200 placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-blue-400";


  const fixed = screenWidth > 850 && "mr-40";
  const iconButtonStyle = `cursor-pointer text-lg transition-all duration-200 ${iconColor} ${hoverIconColor} hover:scale-110`;
  const mobileMenuItemStyle = darkMode
    ? "text-base py-2 px-4 rounded-lg transition-colors hover:bg-gray-700 hover:text-indigo-300"
    : "text-base py-2 px-4 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600";

  return (
    <header
      className={`flex items-center justify-between ${headerBg} px-4 py-2 sticky top-0 z-50 h-14`}
    >
      <div className="flex items-center">
        <div className="rounded-full transition-all duration-300 flex items-center hover:rotate-12">
          <img
            src={blueImage}
            alt={darkMode ? "Dark mode" : "Light mode"}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
        {screenWidth > 1000 && (
          <SearchBarDesktop darkMode={darkMode}></SearchBarDesktop>
        )}
      </div>

      {screenWidth >= 720 ? (
        <nav className={`${fixed} flex gap-6 ${textColor}`}>
          <Link
            to="/"
            className={`flex items-center gap-1  ${hoverTextColor} text-sm font-medium transition-all`}
            title="Home"
          >
            <FontAwesomeIcon icon={faHome} className="text-base" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-1  ${hoverTextColor} text-sm font-medium transition-all`}
            title="Chats"
          >
            <FontAwesomeIcon icon={faCommentDots} className="text-base" />
            <span className="hidden sm:inline">Chats</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-1  ${hoverTextColor} text-sm font-medium transition-all`}
          >
            <FontAwesomeIcon icon={faHistory} className="text-base" />
            <span>Record</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-1 ${hoverTextColor} text-sm font-medium transition-all`}
          >
            <FontAwesomeIcon icon={faCar} className="text-base" />
            <span>Rides</span>
          </Link>
          <Link
            to="/trending"
            className={`flex items-center gap-1  ${hoverTextColor} text-sm font-medium transition-all`}
          >
            <FontAwesomeIcon icon={faFire} className="text-base" />
            <span>Trending</span>
          </Link>
        </nav>
      ) : (
        <button
          className={iconButtonStyle}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      <div className="flex items-center gap-5">
        {screenWidth <= 1000 && (
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => setSearchOpen(!isSearchOpen)}
            className={iconButtonStyle}
          />
        )}

        <div className="relative">
          <FontAwesomeIcon
            icon={faEnvelope}
            onClick={handleMessengerOpen}
            className={iconButtonStyle}
          />
          {generalContext.unreadMessagesCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] animate-pulse">
              {generalContext.unreadMessagesCount}
            </div>
          )}
        </div>

        {isMessengerOpen && <Messenger />}

        <div className="relative">
          <FontAwesomeIcon
            icon={faBell}
            onClick={handleNewNotificationsOpen}
            className={iconButtonStyle}
          />
          {generalContext.unreadNotificationCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] animate-pulse">
              {generalContext.unreadNotificationCount}
            </div>
          )}
        </div>
        {isNotificationsOpen && <NotificationBar />}

        <Link to={`/profile/${user?.id}`} className="relative">
          <div
            className={`w-8 h-8 rounded-full p-[1px] ${
              darkMode
                ? "bg-gradient-to-r from-gray-700 to-gray-500"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            } transition-all hover:scale-110 shadow-md`}
          >
            <img
              src={user?.profilePic}
              alt="Profile"
              className={`w-full h-full object-cover rounded-full border-2 ${
                darkMode ? "border-gray-600" : "border-white"
              }`}
            />
          </div>
        </Link>

        <FontAwesomeIcon
          onClick={() => setDropOpen(!isDropOpen)}
          icon={faAngleDown}
          className={iconButtonStyle}
        />
      </div>
      {isDropOpen && <DropDown />}

      {isMobileMenuOpen && (
        <div className="fixed top-14 left-0 w-full h-[calc(100vh-56px)] bg-black bg-opacity-50 flex justify-center items-start z-50">
          <div
            className={`${mobileMenuBg} ${mobileMenuText} shadow-xl rounded-b-lg p-5 flex flex-col gap-2 w-full max-w-md animate-slideDown`}
          >
            <button
              className={`absolute top-3 right-3 ${
                darkMode ? "text-gray-300" : "text-gray-500"
              } text-xl rounded-full w-8 h-8 flex items-center justify-center ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
            <Link
              to="/"
              className={mobileMenuItemStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#"
              className={mobileMenuItemStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Ride Request
            </Link>
            <Link
              to="#"
              className={mobileMenuItemStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Ride History
            </Link>
            <Link
              to="#"
              className={mobileMenuItemStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Complain
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className={`${mobileMenuItemStyle} flex items-center gap-3`}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}

      <SearchBarSmall
        darkMode={darkMode}
        isSearchOpen={isSearchOpen}
        setSearchOpen={setSearchOpen}
      ></SearchBarSmall>
    </header>
  );
};

export default Header;
