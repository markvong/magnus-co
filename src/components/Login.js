import React from "react";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "./OktaSignInWidget";
import Landing from "./Landing/Landing";
import SignIn from "../components/SignIn/SignIn";
import { useOktaAuth } from "@okta/okta-react";

const Login = (props) => {
  const { authState } = useOktaAuth();

  //   let screen = "";
  //   if (authState.isPending) {
  //     console.log("Waiting");
  //     screen = <div>Loading...</div>;
  //   } else if (!authState.isAuthenticated) {
  //     console.log("not authenticated");
  //     screen = <OktaSignInWidget />;
  //   } else {
  //     console.log("authenticated");
  //     screen = <Redirect to="/" />;
  //   }
  //   return screen;
  // };
  if (authState.isPending) {
    return <div>Loading...</div>;
  }

  return authState.isAuthenticated ? (
    <Redirect to='/profile' />
  ) : (
    <OktaSignInWidget />
  );
};
export default Login;
