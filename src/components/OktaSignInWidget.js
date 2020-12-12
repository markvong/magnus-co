import React, { useEffect } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import { useOktaAuth } from "@okta/okta-react";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import "./OktaSignInWidget.css";
import config from "../config";

const OktaSignInWidget = (props) => {
  const el = "#root";
  const { oktaAuth, authState } = useOktaAuth();
  const { clientId, issuer, redirectUri, baseUrl, scopes } = config.oidc;
  const {
    logo,
    title,
    username_err_msge,
    pw_err_msge,
    sign_in_err
  } = config.screen;

  const widget_config = {
    logo,
    i18n: {
      en: {
        // Screen labels
        "primaryauth.title": title,

        // Error messages
        "error.username.required": username_err_msge,
        "error.password.required": pw_err_msge,
        "errors.E0000004": sign_in_err
      }
    },
    features: {
      registration: true,
      rememberMe: true,
      router: true
    },
    baseUrl,
    clientId,
    redirectUri,
    authParams: {
      issuer
    },
    el
  };

  useEffect(() => {
    const signIn = new OktaSignIn(widget_config);
    signIn
      .showSignInToGetTokens({
        scopes
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
