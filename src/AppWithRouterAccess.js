import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import { OktaAuth } from "@okta/okta-auth-js";
import config from "./config";

import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Protected from "./components/Protected";
import Admin from "./components/Admin";

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
      const oktaAuth = new OktaAuth(config.oidc);

      return (
        <Security oktaAuth={oktaAuth} onAuthRequired={this.onAuthRequired}>
          <Navbar />
          <div className="main-container">
            <Switch>
              <SecureRoute path="/profile" exact={true} component={Profile} />
              <SecureRoute path="/protected" component={Protected} />
              <SecureRoute path="/admin" component={Admin} />
              <Route path="/login" render={() => <Login />} />
              <Route path="/login/callback" component={LoginCallback} />
              <Route path="/" component={Landing} />
            </Switch>
          </div>
        </Security>
      );
    }
  }
);
