import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth, authState } from "@okta/okta-react";

const Navbar = () => {
  return (
    <div className="nav-bar">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/admin">Administration</Link>
    </div>
  );
};

export default Navbar;
