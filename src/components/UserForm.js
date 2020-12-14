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

  const [userGroups, setUserGroups] = useState([]);

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
            // run again to delete perm
            fetch(`${users_endpoint}/${userId}`, options)
              .then((res) => res.text())
              .then((data) => window.location.reload());
          });
      } else {
        console.log("Delete canceled");
      }
    }
  };

  const updateUser = (event, userId) => {
    let parent = document.getElementById(userId);
    console.log(
      parent.querySelectorAll(".user-input").forEach((input) => {
        input.removeAttribute("readonly");
        input.setAttribute("style", "background:yellow");
      })
    );

    parent.querySelector(".user-delete-btn").setAttribute("hidden", "");
    parent.querySelector(".user-save-btn").removeAttribute("hidden");
    parent.querySelector(".user-cancel-save-btn").removeAttribute("hidden");
    event.target.setAttribute("disabled", "true");
  };

  const cancelSave = (userId) => {
    let parent = document.getElementById(userId);
    parent.querySelectorAll(".user-input").forEach((input) => {
      input.setAttribute("readonly", "");
      input.removeAttribute("style");
    });

    parent.querySelector(".user-delete-btn").removeAttribute("hidden");
    parent.querySelector(".user-save-btn").setAttribute("hidden", "");
    parent.querySelector(".user-update-btn").removeAttribute("disabled");
    parent.querySelector(".user-cancel-save-btn").setAttribute("hidden", "");
  };

  const saveUpdate = (userId) => {
    let parent = document.getElementById(userId);
    const userInputs = Array.from(parent.querySelectorAll(".user-input"));
    if (!userInputs.every((input) => input.value.length > 0)) {
      alert("Fill in all fields please.");
    } else {
      const firstName = userInputs[0].value;
      const lastName = userInputs[1].value;
      const email = userInputs[2].value;
      const login = userInputs[3].value;
      const okToSave = window.confirm(
        "Are you sure you want to save changes for this user?"
      );
      if (okToSave) {
        parent.querySelectorAll(".user-input").forEach((input) => {
          input.setAttribute("readonly", "");
          input.removeAttribute("style");
        });

        parent.querySelector(".user-delete-btn").removeAttribute("hidden");
        parent.querySelector(".user-save-btn").setAttribute("hidden", "");
        parent.querySelector(".user-update-btn").removeAttribute("disabled");

        if (authState.isAuthenticated) {
          const accessToken = authState.accessToken["value"];
          const method = "POST";
          const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          };

          const body = JSON.stringify({
            profile: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              login: login
            }
          });

          const options = {
            method,
            headers,
            body
          };

          fetch(`${users_endpoint}/${userId}`, options)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              window.location.reload();
            })
            .catch((err) => console.log(err));
        }
      }
    }
  };

  const getUserGroups = async (userId) => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };

      fetch(`${users_endpoint}/${userId}/groups`, options)
        .then((res) => res.json())
        .then((data) => {
          let parent = document.getElementById(userId);
          let groupTd = parent.querySelector(".user-groups");
          let groups = data
            .map((obj) => `<li>${obj["profile"]["name"]}</li>`)
            .join("\n");
          groupTd.innerHTML = groups;
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    getUsers();
  }, [oktaAuth]);

  return (
    <div id="user-form">
      <h2>User Management</h2>
      <div className="create-user">
        <input onChange={handleFN} placeholder="Enter a first name" />
        <input onChange={handleLN} placeholder="Enter a last name" />
        <input
          onChange={handleEmail}
          placeholder="Enter a valid email address"
        />
        <input onChange={handleLogin} placeholder="Enter a login username" />
        <button onClick={createUser}>Create User</button>
      </div>

      <table>
        <caption>All Users</caption>
        <thead>
          <tr>
            <th></th>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name </th>
            <th>Email</th>
            <th>Login Username</th>
            <th>Groups</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map((user) => {
              getUserGroups(user["id"]);
              return (
                <tr key={user["id"]} id={user["id"]}>
                  <td>
                    <button
                      className="user-update-btn"
                      onClick={(event) => updateUser(event, user["id"])}
                    >
                      Update User
                    </button>
                  </td>
                  <td>{user["id"]}</td>
                  <td>
                    <input
                      className="user-input firstName"
                      type="text"
                      defaultValue={user["profile"]["firstName"]}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      className="user-input lastName"
                      type="text"
                      defaultValue={user["profile"]["lastName"]}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      className="user-input email"
                      type="text"
                      defaultValue={user["profile"]["email"]}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      className="user-input login"
                      type="text"
                      defaultValue={user["profile"]["login"]}
                      readOnly
                    />
                  </td>

                  <td className="user-groups">{"Loading groups..."}</td>

                  <td>
                    {
                      <button
                        className="user-delete-btn"
                        onClick={() =>
                          deleteUser(user["id"], user["profile"]["login"])
                        }
                      >
                        Delete User
                      </button>
                    }
                    {
                      <button
                        className="user-save-btn"
                        hidden
                        onClick={() => saveUpdate(user["id"])}
                      >
                        Save
                      </button>
                    }
                    {
                      <button
                        className="user-cancel-save-btn"
                        hidden
                        onClick={() => cancelSave(user["id"])}
                      >
                        Cancel
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
