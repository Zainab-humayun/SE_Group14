import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from "../../public/logo.jpg";

const UnauthenticatedHeader = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center p-3.5 bg-white shadow-md z-50">
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-800">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />

        {size.width>450 && <small className="text-blue-600">CampusCarawan</small>}
      </div>

      <div className="flex justify-center items-center gap-7"
      >
      <nav className="hidden md:flex gap-4 flex justify-center items-end">
        <Link to="/about" className="text-blue-800 font-medium text-[15px] hover:text-blue-600">About</Link>
        <Link to="/contact-us" className="text-blue-800 font-medium text-[15px] hover:text-blue-600">Contact Us</Link>
      </nav>
      
      <div className="flex gap-3">
  <Link 
    to="/login" 
    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-2 md:px-3 md:py-1.5 rounded-full text-[9.5px] md:text-[12px] transition-all duration-300 hover:from-blue-600 hover:to-blue-700">
    Log In
  </Link>
  <Link 
    to="/signup" 
    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-2 md:px-3 md:py-1.5 rounded-full text-[9.5px] md:text-[12px] transition-all duration-300 hover:from-blue-700 hover:to-blue-900">
    Sign Up
  </Link>


</div>

      </div>
      
      
      
      {/* Mobile Menu */}
      <button
        className="md:hidden text-blue-800 text-2xl"
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 p-5 md:hidden">
          <Link to="/about" className="text-blue-800 font-medium hover:text-blue-600">About</Link>
          <Link to="/contact-us" className="text-blue-800 font-medium hover:text-blue-600">Contact Us</Link>
        </div>
      )}
    </header>
  );
};

export default UnauthenticatedHeader;