import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../services/authServices";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedFullname = fullname.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedFullname || !trimmedEmail) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await signupUser(
        { username: trimmedUsername, fullname: trimmedFullname, email: trimmedEmail, gender, password },
        setLoading,
        setError
      );

      if (res) {
        window.location.assign("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-[94vh] w-full px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden mt-7"
      style={{ backgroundImage: "url('new.gif')" }}
    >
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-center w-80 sm:w-96 mt-10">
        <div className="flex justify-center mb-2">
          <img src="logo.jpg" alt="Logo" className="w-9 h-9 rounded-md" />
        </div>

        <h2 className="text-base font-semibold mb-1 text-[18px]">Create an Account</h2>
        <p className="text-gray-600 text-xs">Sign up to get started</p>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <form className="mt-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-3/4 p-1 text-[13.5px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-2 pl-3"
          />

          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-3/4 p-1 text-[13.5px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-2 pl-3"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-3/4 p-1 text-[13.5px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-2 pl-3"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 p-1 text-[13.5px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-2 pl-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-3/4 p-1 text-[13.3px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-2 pl-3"
          />

          <label className="block text-gray-700 text-sm font-normal mt-1">Gender</label>
          <div className="flex justify-center gap-6 mt-1">
            <label className="text-[13.5px] text-gray-700 items-center">
              <input
                type="radio"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                className="w-2 h-2 mr-1"
              />
              Male
            </label>
            <label className="text-sm text-gray-700 items-center">
              <input
                type="radio"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                className="w-2 h-2 mr-1"
              />
              Female
            </label>
            
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 text-[14px] w-3/4 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-1 rounded-xl font-medium hover:from-blue-700 hover:to-blue-950"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-[10.5px] text-gray-700 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
