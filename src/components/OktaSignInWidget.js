import React, { Component } from "react";
import ReactDOM from "react-dom";
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import "./OktaSignInWidget.css";

export default class OktaSignInWidget extends Component {
  componentDidMount() {
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
      baseUrl: this.props.baseUrl,
      authParams: {}
    };
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn(config);
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError);
  }
  componentWillUnmount() {
    this.widget.remove();
  }
  render() {
    return <div />;
  }
}
