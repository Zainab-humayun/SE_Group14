import { useState, FormEvent } from "react";
import { loginUser } from "../services/authServices";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    const accessToken = await loginUser(
      username,
      password,
      setLoading,
      setError
    );

    if (accessToken) {
      window.location.assign("/");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-[94vh] w-full px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden mt-7"
      style={{ backgroundImage: "url('new.gif')" }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center w-80 sm:w-[350px] mt-10">
        <div className="flex justify-center mb-4">
          <img src="logo.jpg" alt="Logo" className="w-12 h-12 rounded-md" />
        </div>

        <h2 className="text-[18px] font-semibold mb-2">Welcome Back!</h2>
        <p className="text-gray-600 text-xs">Log in to continue</p>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-4/5 p-2 text-[14px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-3 pl-3"
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-4/5 p-2 text-[14px] border border-gray-300 rounded-xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-3 pl-3"
          />

          <button
            type="submit"
            className="mt-4 text-[15px] w-4/5 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-xl font-medium hover:from-blue-700 hover:to-blue-950"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-[10.5px] text-gray-700 mt-3">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
