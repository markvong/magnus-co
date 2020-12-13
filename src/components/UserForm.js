import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";

export default () => {
  const users_endpoint = "https://dev-8181045.okta.com/api/v1/users";

  const { authState, oktaAuth } = useOktaAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");

  const [users, setUsers] = useState("");

  const handleFN = (e) => {
    setFirstName(e.target.value);
  };

  const handleLN = (e) => {
    setLastName(e.target.value);
  };

  const handleLogin = (e) => {
    setLogin(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const createUser = (e) => {
    if (firstName && lastName && login && email && authState.isAuthenticated) {
      let okToAdd = window.confirm(`Create user ${login}?`);
      if (okToAdd) {
        const accessToken = authState.accessToken["value"];
        const method = "POST";
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${accessToken}`);
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({
          profile: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            login: login
          }
        });
        console.log(body);
        const options = {
          method,
          headers,
          body
        };

        fetch(`${users_endpoint}/?activate=false`, options)
          .then((res) => res.json())
          .then((data) => {
            {
              console.log(data);
              window.location.reload();
            }
          })
          .catch((e) => console.log(e));
      } else {
        console.log("Cancel");
      }

      console.log(firstName, lastName, login, email);
    } else {
      alert("Please fill in all the fields.");
    }
  };

  const getUsers = () => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      fetch(users_endpoint, options)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.log(err));
    }
  };

  const deleteUser = (userId, email) => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const method = "DELETE";
      const options = {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      let okToDelete = window.confirm(
        `Are you sure you want to delete user ${email}?`
      );
      if (okToDelete) {
        fetch(`${users_endpoint}/${userId}`, options)
          .then((res) => res.text())
          .then((data) => {
            window.location.reload();
          });
      } else {
        console.log("Delete canceled");
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, [oktaAuth]);

  return (
    <div style={{ minHeight: "100%" }}>
      <h2>User Management</h2>

      <input onChange={handleFN} placeholder="Enter a first name" />
      <input onChange={handleLN} placeholder="Enter a last name" />
      <input onChange={handleEmail} placeholder="Enter a valid email address" />
      <input onChange={handleLogin} placeholder="Enter a login username" />
      <button onClick={createUser}>Create User</button>

      <table>
        <caption>All Users</caption>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name </th>
            <th>Email</th>
            <th>Login Username</th>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map((user) => {
              return (
                <tr key={user["id"]}>
                  <td>{user["id"]}</td>
                  <td>{user["profile"]["firstName"]}</td>
                  <td>{user["profile"]["lastName"]}</td>
                  <td>{user["profile"]["email"]}</td>
                  <td>{user["profile"]["login"]}</td>
                  <td>
                    {
                      <button
                        onClick={() =>
                          deleteUser(user["id"], user["profile"]["login"])
                        }
                      >
                        Delete User
                      </button>
                    }
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>Null</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
