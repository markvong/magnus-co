import React, { useEffect } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import { useOktaAuth } from "@okta/okta-react";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import "./OktaSignInWidget.css";

const OktaSignInWidget = (props) => {
  const el = "#root";
  const { oktaAuth, authState } = useOktaAuth();
  const config = {
    logo: "/images/mountain-solid.svg",
    i18n: {
      en: {
        // Screen labels
        "primaryauth.title": "Welcome! Please Sign In",

        // Error messages
        "error.username.required": "Please provide a valid username.",
        "error.password.required": "Please enter a valid password.",
        "errors.E0000004": "Sign in failed! Try again."
      }
    },
    features: {
      registration: true,
      rememberMe: true,
      router: true
    },
    baseUrl: props.baseUrl,
    authParams: {
      issuer: "https://dev-8181045.okta.com"
      //   authorizeUrl: "https://dev-8181045.okta.com/oauth2/v1/authorize",
      //   tokenUrl: "https://dev-8181045.okta.com/oauth2/v1/token"
    },
    el: el,
    clientId: "0oa22p39epMCbnVSN5d6",
    redirectUri: "http://localhost:3000/login/callback"
  };

  useEffect(() => {
    const signIn = new OktaSignIn(config);
    // signIn.renderEl({ el }, props.onSuccess, props.onError);
    // signIn
    //   .showSignInAndRedirect(
    //     { scopes: ["okta.users.read", "openid", "email"] },
    //     props.onSuccess,
    //     props.onError
    //   )
    //   .catch((err) => console.log(err));

    signIn
      .showSignInToGetTokens({
        scopes: [
          "openid",
          "email",
          "okta.users.read",
          "okta.users.manage",
          "okta.users.manage.self"
        ]
      })
      .then((tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
      });

    return () => {
      signIn.remove();
    };
  }, [oktaAuth]);

  return null;
};

export default OktaSignInWidget;
