import { Link, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noSee, setNoSee] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await fetch("http://localhost:3033/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const resData = await response.json();
      if (response.ok && resData.token) {
        sessionStorage.setItem("token", resData.token);
        navigate("/dashboard");
      } else {
        let fieldErrors = {};
        if (resData.error === "Invalid password!") {
          fieldErrors.password = "Incorrect password";
          setPassword("");
        }
        if (resData.error === "Email not found!") {
          fieldErrors.email = "This email doesn't exist";
          setEmail("");
        }
        if (!fieldErrors.email && !fieldErrors.password) {
          fieldErrors.form = resData.error || "Login failed";
        }
        setErrors(fieldErrors);
      }
    } catch (err) {
      setErrors({ form: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#011937] via-[#003366] to-[#0099cc]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center">
            <div className="h-16 w-16 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-4xl">
              QA
            </div>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#011937] mb-2">Login</h1>
        <p className="text-gray-500 mb-6">
          Welcome back! Please login to your account.
        </p>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-full">
            <div
              className={`flex items-center rounded-xl h-12 px-3 bg-gray-100 border ${errors.email ? "border-red-500" : "border-gray-200"}`}
            >
              <input
                className="flex-1 bg-transparent text-gray-800 text-base placeholder-gray-400 outline-none"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <div className="text-red-500 text-sm ml-2 mt-1">{errors.email}</div>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div
              className={`flex items-center rounded-xl h-12 px-3 bg-gray-100 border ${errors.password ? "border-red-500" : "border-gray-200"}`}
            >
              <input
                className="flex-1 bg-transparent text-gray-800 text-base placeholder-gray-400 outline-none"
                type={noSee ? "password" : "text"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <div className="text-red-500 text-sm ml-2 mt-1">{errors.password}</div>
            )}
          </div>
          {errors.form && (
            <div className="text-red-500 text-sm ml-2 mt-1">{errors.form}</div>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#0099cc] to-[#003399] text-white text-lg font-semibold rounded-xl h-12 mt-2 shadow hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>
        <div className="flex items-center gap-3 my-6 w-full">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex gap-6 mb-4">
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Don’t have an account?
          <span
            className="ml-2 text-[#009966] font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
