import React, { useState } from "react";
import { OktaAuth } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";
import config from "../../config";

import "./SignIn.css";

export default () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    oktaAuth
      .signInWithCredentials({ username: username, password: password })
      .then((res) => {
        console.log(res);
        const sessionToken = res.sessionToken;
        setSessionToken(sessionToken);
        oktaAuth.signInWithRedirect({ sessionToken });
      })
      .catch((err) => console.log(err));
  };
  if (sessionToken) return null;
  return (
    <div id='sign-in-container'>
      <label>
        Username:
        <input
          id='username'
          name='username'
          value={username}
          onChange={handleUsername}
        />
      </label>

      <label>
        Password:
        <input
          id='password'
          name='password'
          value={password}
          onChange={handlePassword}
          type='password'
        />
      </label>

      <button id='submit' onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
};
