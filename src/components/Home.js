import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

const Home = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [currLogin, setCurrLogin] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);

  const history = useHistory();

  const curr_user_endpoint = `https://dev-8181045.okta.com/api/v1/users/me`;

  const login = async () => history.push("/login");
  const logout = async () => {
    await setLastLogin();
    oktaAuth.signOut();
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

      fetch(curr_user_endpoint, options)
        .then((response) => response.text())
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  const checkUser = async () => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else if (authState.isAuthenticated && !userInfo) {
      oktaAuth.getUser().then((info) => setUserInfo(info));
    }
  };

  const getLastLogin = async () => {
    if (authState.isAuthenticated && userInfo) {
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
          setLoginInfo(data["profile"]["last_Login"]);
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    checkUser();
    getLastLogin();
  }, [userInfo, loginInfo]);

  if (authState.isPending) return null;
  const button =
    authState.isAuthenticated && userInfo ? (
      <button onClick={logout}>Logout</button>
    ) : (
      <button onClick={login}>Login</button>
    );
  const style = {
    border: "1px red solid",
    display: "flex",
    flexDirection: "column"
  };
  return (
    <div style={style}>
      <Link to="/">Home</Link>
      <br />
      <Link to="/protected">Protected</Link>
      <br />
      {userInfo ? (
        <div>
          <p>Your ID is: {JSON.stringify(userInfo["sub"])}</p>
          <p>
            You last logged in on {new Date(loginInfo).toDateString()} at{" "}
            {new Date(loginInfo).toTimeString()}
          </p>
        </div>
      ) : (
        "Null"
      )}
      {button}
    </div>
  );
};

export default Home;
