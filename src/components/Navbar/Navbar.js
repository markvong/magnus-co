import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import "./Navbar.css";

const Navbar = (props) => {
  const curr_user_endpoint = `https://dev-8181045.okta.com/api/v1/users/me`;

  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();
  const [userInfo, setUserInfo] = useState(null);
  const [currLogin, setCurrLogin] = useState(null);

  const login = async () => history.push("/login");
  const logout = async () => {
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
          setUserInfo(data);
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

  const handleLinkClicked = (e) => {
    e.target.classList.add("current");
    Array.from(document.querySelectorAll("a"))
      .filter((a) => a !== e.target)
      .forEach((a) => a.classList.remove("current"));
  };

  const loginBtn = (
    <button
      onClick={login}
      className='nav-log-btn btn btn-primary'
      id='login-btn'
    >
      Login
    </button>
  );
  const logoutBtn = (
    <button
      onClick={logout}
      className='nav-log-btn btn btn-primary'
      id='logout-btn'
    >
      Logout
    </button>
  );

  // let button = authState.isPending ? (
  //   <button></button>
  // ) : !authState.isAuthenticated ? (
  //   loginBtn
  // ) : (
  //   logoutBtn
  // );

  useEffect(() => {
    getLastLogin();
  }, [oktaAuth, authState]);

  return (
    <div id='nav-bar'>
      <div id='logo-div'>
        <Link to='/' className='logo-link'>
          <img src='/images/mountain-solid.png' id='logo' alt='logo' />
          <span className='logo-text'>Magnus</span>
        </Link>
      </div>
      <div id='links-div'>
        <Link to='/' className='nav-link' id='home' onClick={handleLinkClicked}>
          Home
        </Link>
        <Link
          to='/about'
          className='nav-link'
          id='about'
          onClick={handleLinkClicked}
        >
          About Us
        </Link>
      </div>
      <div id='nav-login-container'>
        {authState.isAuthenticated && userInfo ? (
          <div id='navbar-login'>
            <span className='user-login'>{userInfo["profile"]["login"]}</span>
            <div id='dropdown-content'>
              <Link
                to='/profile'
                className='nav-link'
                id='profile'
                onClick={handleLinkClicked}
              >
                Profile
              </Link>
              <Link
                to='/admin'
                className='nav-link'
                id='admin'
                onClick={handleLinkClicked}
              >
                Administration
              </Link>
              <a
                href='https://dev-8181045.okta.com/app/UserHome?fromAdmin=true'
                target='_blank'
                rel='noreferrer'
                className='nav-link'
                id='okta'
                onClick={handleLinkClicked}
              >
                Okta Apps
              </a>
              {logoutBtn}
            </div>
          </div>
        ) : (
          loginBtn
        )}
      </div>
    </div>
  );
};

export default Navbar;
