import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import "./Profile.css";

const Profile = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [currLogin, setCurrLogin] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const [userGroups, setUserGroups] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const history = useHistory();

  const curr_user_endpoint = `https://dev-8181045.okta.com/api/v1/users/me`;

  const login = async () => history.push("/login");
  const logout = async () => {
    setLastLogin().then((res) => {
      if (res === "SET") {
        oktaAuth.signOut();
      } else {
        console.log("Waiting to sign out.");
      }
    });
  };

  const setLastLogin = async () => {
    if (loginInfo && authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      myHeaders.append("Content-Type", "application/json");

      var data = JSON.stringify({ profile: { last_Login: currLogin } });

      var options = {
        method: "POST",
        headers: myHeaders,
        body: data
      };

      return fetch(curr_user_endpoint, options)
        .then((response) => response.text())
        .then((res) => {
          return "SET";
        })
        .catch((err) => console.log(err));
    }
  };

  const checkUser = async () => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else if (authState.isAuthenticated && !userInfo) {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
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
          setCurrLogin(data["lastLogin"]);
          setLoginInfo(data);
        })
        .catch((err) => console.log(err));
    }
  };

  const getUserGroups = async () => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
      fetch(`${curr_user_endpoint}/groups`, options)
        .then((res) => res.json())
        .then((data) => {
          if (!userGroups)
            setUserGroups(data.map((obj) => obj["profile"]["name"]));
        })
        .catch((err) => console.log(err));
    }
  };

  const editBtnClicked = () => {
    setEditMode(true);
  };

  const saveBtnClicked = () => {
    setEditMode(false);
  };

  const cancelBtnClicked = () => {
    setEditMode(false);
  };

  useEffect(() => {
    checkUser();
    getLastLogin();
    getUserGroups();
  }, [oktaAuth]);

  if (authState.isPending) return null;
  const button =
    authState.isAuthenticated && userInfo && currLogin ? (
      <button onClick={logout}>Logout</button>
    ) : (
      <button onClick={login}>Login</button>
    );
  console.log(loginInfo);
  const name = loginInfo
    ? `${loginInfo["profile"]["firstName"]} ${loginInfo["profile"]["lastName"]}`
    : "Anon";
  const userID = userInfo ? userInfo["sub"] : "No ID exists.";
  const lastLogged = loginInfo
    ? `${new Date(
        loginInfo["profile"]["last_Login"]
      ).toDateString()} at ${new Date(
        loginInfo["profile"]["last_Login"]
      ).toTimeString()}`
    : "unknown date and time";

  const editBtn = (
    <button
      id="edit-button"
      className="btn btn-primary prof-btn"
      onClick={editBtnClicked}
    >
      Edit Profile
    </button>
  );
  const saveBtn = (
    <button
      id="save-button"
      className="btn btn-primary prof-btn"
      onClick={saveBtnClicked}
    >
      Save Changes
    </button>
  );
  const cancelBtn = (
    <button
      id="cancel-button"
      className="btn btn-primary prof-btn"
      onClick={cancelBtnClicked}
    >
      Cancel
    </button>
  );
  return (
    <div id="profile-container">
      {userInfo && loginInfo ? (
        <div id="inner-profile-container">
          <h3 id="profile-title">
            Welcome back, <span id="profile-name">{name}</span>!
          </h3>
          <div id="profile-grid-container" className="grid-container">
            <h4 className="container-title" id="profile-title">
              Profile Information
            </h4>
            <span id="id-label" className="label-cell cell">
              User ID:
            </span>
            <span id="id-val" className="value-cell cell">
              {userID}
            </span>

            <span id="member-id-label" className="label-cell cell">
              Member ID:
            </span>
            <span id="member-id-val" className="value-cell cell">
              {loginInfo["profile"]["memberId"]}
            </span>

            <span id="manager-id-label" className="label-cell cell">
              Manager ID:
            </span>
            <span id="manager-id-val" className="value-cell cell">
              {loginInfo["profile"]["managerId"]}
            </span>

            <span id="login-label" className="label-cell cell">
              Last login:
            </span>
            <span id="login-val" className="value-cell cell">
              {lastLogged}
            </span>

            <span id="fname-label" className="label-cell cell">
              First Name:
            </span>
            <input
              id="fname-value"
              className="value-cell cell"
              defaultValue={loginInfo["profile"]["firstName"]}
              readOnly
            />

            <span id="lname-label" className="label-cell cell">
              Last Name:
            </span>
            <input
              id="lname-value"
              className="value-cell cell"
              defaultValue={loginInfo["profile"]["lastName"]}
              readOnly
            />
          </div>

          <div id="groups-container" className="grid-container">
            <h4 className="container-title">Groups that you're a part of</h4>
            <ol id="profile-groups-list">
              {userGroups
                ? userGroups.map((group, idx) => (
                    <li key={idx} className="profile-groups">
                      {group}
                    </li>
                  ))
                : ""}
            </ol>
          </div>

          <div id="buttons-container">
            {editMode ? (
              <div>
                {saveBtn}
                {cancelBtn}
              </div>
            ) : (
              editBtn
            )}
            {/* {button} */}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;
