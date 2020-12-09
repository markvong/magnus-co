import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { OktaAuth } from "@okta/okta-auth-js";
import { LoginCallback, Security } from "@okta/okta-react";
import Home from "./components/Home";
import AppWithRouterAccess from "./AppWithRouterAccess";
import "./App.css";

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
