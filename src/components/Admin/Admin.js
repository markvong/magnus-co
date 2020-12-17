import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import GroupForm from "../GroupForm/GroupForm";
import UserForm from "../UserForm/UserForm";
import "./Admin.css";

export default () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [userGroups, setUserGroups] = useState(null);

  const curr_user_endpoint = `https://dev-8181045.okta.com/api/v1/users/me`;

  const getUserInfo = async () => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else if (authState.isAuthenticated && !userInfo) {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  };

  const getProfileInfo = async () => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
      fetch(curr_user_endpoint, options)
        .then((res) => res.json())
        .then((data) => setProfileInfo(data))
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

  useEffect(() => {
    getUserInfo();
    getProfileInfo();
    getUserGroups();
  }, [oktaAuth]);

  const isAdmin =
    userInfo &&
    profileInfo &&
    userGroups &&
    userGroups.includes("Administrators");

  return (
    <div id="admin-container">
      {isAdmin ? (
        <div id="inner-admin-container">
          <h3 id="admin-welcome-title">
            Welcome back,{" "}
            <span className="admin-name">
              Administrator {profileInfo["profile"]["firstName"]}{" "}
              {profileInfo["profile"]["lastName"]}
            </span>
          </h3>
          <GroupForm />
          <UserForm />
        </div>
      ) : (
        <h3>You need administrator privileges to view this page.</h3>
      )}
    </div>
  );
};
