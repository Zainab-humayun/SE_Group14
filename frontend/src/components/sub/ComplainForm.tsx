import { useState, useEffect, useRef } from 'react';
import { FiAlertCircle, FiSend, FiX } from 'react-icons/fi';
import { postRequest } from '../../services/apiRequests';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';

interface ComplainFormProps {
  targetId: string;
  darkMode: boolean;
  onClose: () => void;
}

const ComplainForm = ({ targetId, darkMode, onClose }: ComplainFormProps) => {
  const auth = useContext(AuthContext);

  console.log("dasdasda",targetId);

  if (!auth) {
    return;
  }

  const [complain, setComplain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!complain.trim()) {
      setError('Please enter your complaint');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    const url = "/general/create-complain";
  
    try {
      await postRequest({targetId, complain}, url, auth.accessToken, setIsLoading, setError);
  
      console.log('Complaint submitted:', { complain, targetId });
      setIsSubmitted(true);
      setComplain('');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Uber-inspired color scheme with inverted buttons
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-white';
  
  // Inverted button colors (dark in light mode, light in dark mode)
  const buttonBg = darkMode ? 'bg-white hover:bg-gray-100 text-black' : 'bg-black hover:bg-gray-800 text-white';
  const disabledButtonBg = darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600';
  
  const successBg = darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
  const errorBg = darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
  const accentColor = 'text-green-500'; // Uber's signature green

  return (
    <>
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
      
      {/* Form Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          ref={formRef}
          className={`${bgColor} ${textColor} rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative border ${borderColor}`}
        >
          {/* Header with close button - Uber-style */}
          <div className={`flex justify-between items-center p-4 border-b ${borderColor}`}>
            <h2 className="text-xl font-semibold flex items-center">
              <FiAlertCircle className={`mr-2 ${accentColor}`} />
              File a Complaint
            </h2>
            <button 
              onClick={onClose}
              className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              aria-label="Close complaint form"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Form Content - Uber-inspired */}
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="complain" className={`block text-sm font-medium mb-1 ${secondaryText}`}>
                  Your Complaint
                </label>
                <textarea
                  id="complain"
                  rows={4}
                  className={`w-full px-3 py-2 border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBg} ${textColor}`}
                  placeholder="Describe your complaint in detail..."
                  value={complain}
                  onChange={(e) => {
                    setComplain(e.target.value);
                    setError(null);
                  }}
                  required
                />
              </div>

              {error && (
                <div className={`mb-4 p-3 rounded-md text-sm ${errorBg} flex items-center`}>
                  <FiAlertCircle className="mr-2" />
                  {error}
                </div>
              )}

              {isSubmitted && !isLoading && !error && (
                <div className={`mb-4 p-3 rounded-md text-sm ${successBg} flex items-center`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Complaint submitted successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !complain.trim()}
                className={`flex items-center justify-center w-full px-4 py-3 rounded-md ${isLoading || !complain.trim() ? disabledButtonBg : buttonBg} transition-colors font-medium`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Submit Complaint
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplainForm;