import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import "./Navbar.css";

const Navbar = () => {
  const curr_user_endpoint = `https://dev-8181045.okta.com/api/v1/users/me`;

  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();
  const [currLogin, setCurrLogin] = useState(null);

  const login = async () => history.push("/login");
  const logout = async () => {
    // oktaAuth.signOut();
    setLastLoginAndSignOut();
  };

  const getLastLogin = async () => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      fetch(curr_user_endpoint, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setCurrLogin(data["lastLogin"]);
        })
        .catch((err) => console.log(err));
    }
  };

  const setLastLoginAndSignOut = async () => {
    if (currLogin && authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const method = "POST";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      };

      const body = JSON.stringify({ profile: { last_Login: currLogin } });

      const options = {
        method,
        headers,
        body
      };

      fetch(curr_user_endpoint, options)
        .then((response) => response.text())
        .then((res) => {
          oktaAuth.signOut();
        })
        .catch((err) => console.log(err));
    }
  };

  const loginBtn = (
    <button onClick={login} className="nav-log-btn btn btn-primary">
      Login
    </button>
  );
  const logoutBtn = (
    <button onClick={logout} className="nav-log-btn btn btn-primary">
      Logout
    </button>
  );

  let button = authState.isPending ? (
    <button></button>
  ) : !authState.isAuthenticated ? (
    loginBtn
  ) : (
    logoutBtn
  );

  useEffect(() => {
    getLastLogin();
  }, [authState]);

  return (
    <div id="nav-bar">
      <div id="logo-div">
        <Link to="/" className="logo-link">
          <img src="/images/mountain-solid.png" id="logo" />
          <span className="logo-text">Magnus</span>
        </Link>
      </div>
      <div id="links-div">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/admin" className="nav-link">
          Administration
        </Link>
        <a
          href="https://dev-8181045.okta.com/app/UserHome"
          target="_blank"
          className="nav-link"
        >
          Okta Apps
        </a>
        {button}
      </div>
    </div>
  );
};

export default Navbar;
