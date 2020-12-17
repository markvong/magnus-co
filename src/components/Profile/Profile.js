import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import "./Profile.css";

const Profile = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const [userGroups, setUserGroups] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const history = useHistory();

  const curr_user_endpoint = `https://dev-8181045.okta.com/api/v1/users/me`;

  const checkUser = async () => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else if (authState.isAuthenticated && !userInfo) {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  };

  const getUserInfo = async () => {
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
          setLoginInfo(data);
          setFName(data["profile"]["firstName"]);
          setLName(data["profile"]["lastName"]);
          setEmail(data["profile"]["email"]);
          setUsername(data["profile"]["login"]);
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

  const updateUser = () => {
    const okToUpdate = window.confirm("Save updates to your profile?");
    if (okToUpdate) {
      if (authState.isAuthenticated) {
        const accessToken = authState.accessToken["value"];
        const method = "POST";
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        };
        const body = JSON.stringify({
          profile: {
            firstName: fName,
            lastName: lName,
            email: email,
            login: username
          }
        });
        const options = {
          method,
          headers,
          body
        };

        fetch(curr_user_endpoint, options)
          .then((res) => res.json())
          .then((data) => window.location.reload())
          .catch((err) => console.log(err));
      }
    }
  };

  const handleFName = (e) => {
    setFName(e.target.value);
  };

  const handleLName = (e) => {
    setLName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const editBtnClicked = () => {
    setEditMode(true);
    toggleFields(false);
  };

  const saveBtnClicked = () => {
    setEditMode(false);
    toggleFields(true);
    updateUser();
  };

  const cancelBtnClicked = () => {
    setEditMode(false);
    toggleFields(true);
  };

  const toggleFields = (toggle) => {
    const fNameInput = document.getElementById("fname-val");
    const lNameInput = document.getElementById("lname-val");
    const emailInput = document.getElementById("email-val");
    const usernameInput = document.getElementById("username-val");

    const setReadOnly = (isReadOnly, ...fields) => {
      fields.forEach((field) => {
        if (isReadOnly) {
          field.setAttribute("readonly", "true");
          field.setAttribute("style", "background:rgba(255,255,255,0.1);");
        } else {
          field.removeAttribute("readonly");
          field.setAttribute("style", "background:rgba(255,255,255,0.4);");
        }
      });
    };
    setReadOnly(toggle, fNameInput, lNameInput, emailInput, usernameInput);
  };

  useEffect(() => {
    checkUser();
    getUserInfo();
    getUserGroups();
  }, [oktaAuth]);

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
      className="btn btn-info prof-btn"
      onClick={editBtnClicked}
    >
      Edit Profile
    </button>
  );
  const saveBtn = (
    <button
      id="save-button"
      className="btn btn-success prof-btn"
      onClick={saveBtnClicked}
    >
      Save Changes
    </button>
  );
  const cancelBtn = (
    <button
      id="cancel-button"
      className="btn btn-warning prof-btn"
      onClick={cancelBtnClicked}
    >
      Cancel
    </button>
  );

  return (
    <div id="profile-container">
      {userInfo && loginInfo ? (
        <div id="inner-profile-container">
          <h3 id="overall-profile-title">
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

            <span id="username-label" className="label-cell cell">
              Username:
            </span>
            <input
              id="username-val"
              className="value-cell cell"
              defaultValue={username}
              onChange={handleUsername}
              readOnly
            />

            <span id="email-label" className="label-cell cell">
              Email:
            </span>
            <input
              id="email-val"
              className="value-cell cell"
              defaultValue={email}
              onChange={handleEmail}
              readOnly
            />

            <span id="fname-label" className="label-cell cell">
              First Name:
            </span>
            <input
              id="fname-val"
              className="value-cell cell"
              defaultValue={fName}
              readOnly
              onChange={handleFName}
            />

            <span id="lname-label" className="label-cell cell">
              Last Name:
            </span>
            <input
              id="lname-val"
              className="value-cell cell"
              defaultValue={lName}
              onChange={handleLName}
              readOnly
            />
          </div>

          <div id="groups-container" className="grid-container">
            <h4 className="container-title" id="groups-title">
              Your Groups
            </h4>
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
