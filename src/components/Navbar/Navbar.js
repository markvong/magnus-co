import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import "./Navbar.css";

const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();
  const login = async () => history.push("/login");
  const logout = async () => {
    oktaAuth.signOut();
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
