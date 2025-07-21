import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerStoreUser, loginUser, getLoggedInUserData } from "../lib/api"; // adjust path if needed
import { myStoreHook } from "../MyStoreContext"; // adjust path if needed

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const {
    setUserLoggedInStatus,
    setLoggedInUserData,
    setPageLoading,
  } = myStoreHook();

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

  // Handle login input change
  const handleOnChangeLoginFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login form submit
  const handleLoginFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPageLoading(true);

    try {
      const response = await loginUser({
        username: loginData.login_username,
        password: loginData.login_password,
      });

      localStorage.setItem("auth_token", response.token);
      setUserLoggedInStatus(true);

      const userData = await getLoggedInUserData(response.token);
      const loggedInUserData = {
        id: userData.id,
        name: userData.name,
        email: response.user_email,
        username: response.user_nicename,
      };

      localStorage.setItem("user_data", JSON.stringify(loggedInUserData));
      setLoggedInUserData(JSON.stringify(loggedInUserData));

      toast.success("User logged in Successfully");
      setLoginData({ login_username: "", login_password: "" });
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Invalid login details");
    } finally {
      setPageLoading(false);
    }
  };

  // Handle signup input change
  const handleOnChangeSignUpFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signup form submit
  const handleSignUpFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPageLoading(true);

    try {
      await registerStoreUser({
        name: signUpData.signup_name,
        username: signUpData.signup_username,
        email: signUpData.signup_email,
        password: signUpData.signup_password,
      });

      toast.success("User registered successfully!");
      setSignUpData({
        signup_name: "",
        signup_email: "",
        signup_username: "",
        signup_password: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Signup failed");
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Login / Signup</h1>
      <div className="row">
        {/* Login Form */}
        <div className="col-md-6">
          <h2>Login</h2>
          <form onSubmit={handleLoginFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="login_username"
                value={loginData.login_username}
                onChange={handleOnChangeLoginFormData}
                className="form-control"
                placeholder="Enter username"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="login_password"
                value={loginData.login_password}
                onChange={handleOnChangeLoginFormData}
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Login
            </button>
          </form>
        </div>

        {/* Signup Form */}
        <div className="col-md-6">
          <h2>Signup</h2>
          <form onSubmit={handleSignUpFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="signup_name"
                value={signUpData.signup_name}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="signup_email"
                value={signUpData.signup_email}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="signup_username"
                value={signUpData.signup_username}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter username"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="signup_password"
                value={signUpData.signup_password}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="btn btn-success mt-3">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
