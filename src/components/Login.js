import React from "react";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "./OktaSignInWidget";
import { useOktaAuth } from "@okta/okta-react";

const Login = (props) => {
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = (res) => {
    // console.log(res);
    if (res.status === "SUCCESS") {
      return oktaAuth.signInWithRedirect({
        scopes: ["okta.users.read", "openid", "profile"]
        // sessionToken: res.session.token
      });
    }
  };

  const onError = (err) => {
    console.log("error logging in", err);
  };

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
    <OktaSignInWidget
      baseUrl={props.baseUrl}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

export default Login;
