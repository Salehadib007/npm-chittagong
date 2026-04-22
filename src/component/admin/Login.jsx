import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import { useSetup } from "../../../context/SetupContext";
import navyLogo from "../../assets/navyLogo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { auth, login } = useAuth();
  const { fetchSetup } = useSetup();
  const navigate = useNavigate();

  const credentials = { username, password };

  // ✅ Redirect to home if already logged in
  useEffect(() => {
    if (auth) {
      navigate("/"); // redirect to home
    }
  }, [auth, navigate]);

  const connect = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);

      fetchSetup();

      // Update context
      login(res.data);

      // Persist in localStorage
      localStorage.setItem("auth", JSON.stringify(res.data));

      navigate("/"); // go home
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-white/70"></div>

      <div className="relative z-10 w-full max-w-md bg-[#e9e8e2] rounded-md shadow-lg px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 mb-3 bg-transparent">
            <img
              src={navyLogo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold">
            <span className="text-red-600">NP</span>
            <span className="text-blue-900">M</span>
          </h1>
          <p className="text-xs text-gray-600 text-center mt-1">
            NAVAL PROVOST MARSHAL - CHITTAGONG
          </p>
        </div>

        <h2 className="text-center text-lg font-semibold mb-6 tracking-wide">
          LOGIN
        </h2>

        <div className="mb-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <FaUser />
          </span>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <FaLock />
          </span>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={() => connect(credentials)}
          className="w-full border border-gray-400 py-2 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
