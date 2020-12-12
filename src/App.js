import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { OktaAuth } from "@okta/okta-auth-js";
import { LoginCallback, Security } from "@okta/okta-react";
import AppWithRouterAccess from "./AppWithRouterAccess";
import "./App.css";
require("dotenv").config();

class App extends Component {
  render() {
    return (
      <Router>
        <AppWithRouterAccess />
      </Router>
    );
  }
}

export default App;
