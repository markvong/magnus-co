import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

const Profile = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [currLogin, setCurrLogin] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const [userGroups, setUserGroups] = useState(null);

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
  const style = {
    border: "1px red solid",
    display: "flex",
    flexDirection: "column"
  };

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

  return (
    <div style={style}>
      {userInfo && loginInfo ? (
        <div>
          <ul>
            <li>Welcome back {name}!</li>
            <li>Your user ID is: {userID}</li>
            <li>You last logged in on {lastLogged}.</li>
            <li>Groups that you're a part of:</li>
            <ul>
              {userGroups
                ? userGroups.map((group, idx) => <li key={idx}>{group}</li>)
                : ""}
            </ul>
          </ul>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {button}
    </div>
  );
};

export default Profile;
