import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMyStore } from "../MyStoreContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const {
    setUserLoggedInStatus,
    setLoggedInUserData,
    setPageLoading,
  } = useMyStore();

  const [loginData, setLoginData] = useState({
    login_username: "",
    login_password: "",
  });

  const [signUpData, setSignUpData] = useState({
    signup_name: "",
    signup_email: "",
    signup_username: "",
    signup_password: "",
  });

  // --- Handle form changes ---
  const handleOnChangeLoginFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnChangeSignUpFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Register User ---
  const handleSignUpFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPageLoading(true);

    try {
      const response = await fetch("/wp-json/wc-react/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signUpData.signup_username,
          email: signUpData.signup_email,
          password: signUpData.signup_password,
          name: signUpData.signup_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User registered successfully! Please log in.");
        setSignUpData({
          signup_name: "",
          signup_email: "",
          signup_username: "",
          signup_password: "",
        });
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Signup failed");
    } finally {
      setPageLoading(false);
    }
  };

  // --- Login User using JWT plugin endpoint ---
  const handleLoginFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPageLoading(true);

    try {
      const response = await fetch("/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.login_username,
          password: loginData.login_password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token
        localStorage.setItem("auth_token", data.token);

        // Map user data depending on your JWT plugin response
        const loggedInUserData = {
          id: data.user_id || data.user?.id, // adjust if needed
          name: data.user_display_name || data.user?.name || loginData.login_username,
          email: data.user_email || data.user?.email || "",
          username: data.user_nicename || loginData.login_username,
        };

        localStorage.setItem("user_data", JSON.stringify(loggedInUserData));
        setUserLoggedInStatus(true);
        setLoggedInUserData(loggedInUserData);

        toast.success("Logged in successfully!");
        setLoginData({ login_username: "", login_password: "" });
        navigate("/cart");
      } else {
        toast.error(data.message || "Invalid login details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-center mb-10">Login / Signup</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleLoginFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="login_username"
                  value={loginData.login_username}
                  onChange={handleOnChangeLoginFormData}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="login_password"
                  value={loginData.login_password}
                  onChange={handleOnChangeLoginFormData}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Login
              </button>
            </form>
          </div>

          {/* Signup Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Signup</h2>
            <form onSubmit={handleSignUpFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="signup_name"
                  value={signUpData.signup_name}
                  onChange={handleOnChangeSignUpFormData}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="signup_email"
                  value={signUpData.signup_email}
                  onChange={handleOnChangeSignUpFormData}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="signup_username"
                  value={signUpData.signup_username}
                  onChange={handleOnChangeSignUpFormData}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="signup_password"
                  value={signUpData.signup_password}
                  onChange={handleOnChangeSignUpFormData}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
