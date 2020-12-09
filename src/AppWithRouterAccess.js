import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import Home from "./components/Home";
import Login from "./components/Login";
import Protected from "./components/Protected";
import { OktaAuth } from "@okta/okta-auth-js";

export default withRouter(
  class AppWithRouterAccess extends Component {
    constructor(props) {
      super(props);
      this.onAuthRequired = this.onAuthRequired.bind(this);
    }

    onAuthRequired() {
      this.props.history.push("/login");
    }

    render() {
      const oktaAuth = new OktaAuth({
        issuer: "https://dev-8181045.okta.com/oauth2/default",
        clientId: "0oa22p39epMCbnVSN5d6",
        redirectUri: window.location.origin + "/login/callback"
      });

      return (
        <Security oktaAuth={oktaAuth} onAuthRequired={this.onAuthRequired}>
          <SecureRoute path="/" exact={true} component={Home} />
          <SecureRoute path="/protected" component={Protected} />
          <Route
            path="/login"
            render={() => <Login baseUrl="https://dev-8181045.okta.com" />}
          />
          <Route path="/login/callback" component={LoginCallback} />
        </Security>
      );
    }
  }
);
