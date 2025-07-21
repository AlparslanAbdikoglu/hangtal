import React from "react";

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
    <div className="container">
      <h1 className="my-4">My Account</h1>
      <div id="user-info">
        <form>
          <div className="mb-3 row">
            <label htmlFor="formName" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                value={userdata.name}
                readOnly
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="formEmail" className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                value={userdata.email}
                readOnly
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="formUsername" className="col-sm-2 col-form-label">Username</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                value={userdata.username}
                readOnly
              />
            </div>
          </div>
        </form>
      </div>
      <div id="loading-message" style={{ display: "none" }}>
        <p>Loading user information...</p>
      </div>
    </div>
  );
};

export default MyAccount;
