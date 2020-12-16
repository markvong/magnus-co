import React from "react";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "./OktaSignInWidget";
import Landing from "./Landing/Landing";
import { useOktaAuth } from "@okta/okta-react";

const Login = (props) => {
  const { authState } = useOktaAuth();

  let screen = "";
  if (authState.isPending) {
    console.log("Waiting");
    screen = <div>Loading...</div>;
  } else if (!authState.isAuthenticated) {
    console.log("not authenticated");
    screen = <OktaSignInWidget />;
  } else {
    console.log("authenticated");
    screen = <Redirect to="/" />;
  }
  return screen;
};

export default Login;
