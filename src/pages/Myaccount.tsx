import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface UserData {
  name: string;
  email: string;
  username: string;
}

interface MyAccountProps {
  loggedInUserData: string; // JSON stringified user data
}

const MyAccount: React.FC<MyAccountProps> = ({ loggedInUserData }) => {
  const userdata: UserData = JSON.parse(loggedInUserData);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-8 text-center">My Account</h1>

          <form>
            {/* Name */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center">
              <label htmlFor="formName" className="md:w-1/4 font-medium mb-2 md:mb-0">
                Name
              </label>
              <input
                id="formName"
                type="text"
                className="md:w-3/4 border border-gray-300 rounded p-3 bg-gray-100 cursor-not-allowed"
                value={userdata.name}
                readOnly
              />
            </div>

            {/* Email */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center">
              <label htmlFor="formEmail" className="md:w-1/4 font-medium mb-2 md:mb-0">
                Email
              </label>
              <input
                id="formEmail"
                type="email"
                className="md:w-3/4 border border-gray-300 rounded p-3 bg-gray-100 cursor-not-allowed"
                value={userdata.email}
                readOnly
              />
            </div>

            {/* Username */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center">
              <label htmlFor="formUsername" className="md:w-1/4 font-medium mb-2 md:mb-0">
                Username
              </label>
              <input
                id="formUsername"
                type="text"
                className="md:w-3/4 border border-gray-300 rounded p-3 bg-gray-100 cursor-not-allowed"
                value={userdata.username}
                readOnly
              />
            </div>
          </form>

          {/* Loading placeholder hidden by default */}
          <div id="loading-message" className="hidden mt-6 text-center text-gray-600">
            <p>Loading user information...</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
