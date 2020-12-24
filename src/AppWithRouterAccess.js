import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import { OktaAuth } from "@okta/okta-auth-js";
import config from "./config";

import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login";
import Landing from "./components/Landing/Landing";
import Admin from "./components/Admin/Admin";
import About from "./components/About/About";

const AppWithRouterAccess = () => {
  const history = useHistory();

  const onAuthRequired = () => {
    history.push("/login");
  };

  const oktaAuth = new OktaAuth(config.oidc);

  return (
    <Security oktaAuth={oktaAuth} onAuthRequired={onAuthRequired}>
      <Navbar />
      <div className='main-container'>
        <Switch>
          <SecureRoute path='/profile' render={() => <Profile />} />
          <SecureRoute path='/admin' render={() => <Admin />} />
          <Route path='/about' render={() => <About />} />
          <Route path='/login/callback' component={LoginCallback} />
          <Route path='/login' render={() => <Login />} />
          <Route path='/' exact={true} render={() => <Landing />} />
        </Switch>
      </div>
    </Security>
  );
};

export default AppWithRouterAccess;
