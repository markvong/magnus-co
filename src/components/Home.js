import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withOktaAuth } from "@okta/okta-react";

export default withOktaAuth(
  class Home extends Component {
    constructor(props) {
      super(props);
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
    }

    async login() {
      this.props.history.push("/login");
    }

    async logout() {
      this.props.oktaAuth.signOut("/");
    }

    render() {
      if (this.props.authState.isPending) return null;
      const button = this.props.authState.isAuthenticated ? (
        <button onClick={this.logout}>Logout</button>
      ) : (
        <button onClick={this.login}>Login</button>
      );
      const style = {
        border: "1px red solid",
        display: "flex",
        flexDirection: "row"
      };
      return (
        <div style={style}>
          <Link to="/">Home</Link>
          <br />
          <Link to="/protected">Protected</Link>
          <br />
          {button}
        </div>
      );
    }
  }
);
