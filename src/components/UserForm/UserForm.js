import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import "./UserForm.css";

const UserForm = (props) => {
  const users_endpoint = "https://dev-8181045.okta.com/api/v1/users";
  const { authState, oktaAuth } = useOktaAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [managerId, setManagerId] = useState("");

  const [users, setUsers] = useState("");

  const [viewUsers, setViewUsers] = useState(true);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusClass, setStatusClass] = useState("");

  const clearCreateVals = () => {
    const fNameInput = document.getElementById("first-name-input");
    const lNameInput = document.getElementById("last-name-input");
    const emailInput = document.getElementById("email-input");
    const loginInput = document.getElementById("login-input");
    const memberIdInput = document.getElementById("member-id-input");
    const managerIdInput = document.getElementById("manager-id-input");
    fNameInput.value = "";
    lNameInput.value = "";
    emailInput.value = "";
    loginInput.value = "";
    memberIdInput.value = "";
    managerIdInput.value = "";
    setFirstName("");
    setLastName("");
    setEmail("");
    setLogin("");
    setMemberId("");
    setManagerId("");
  };

  const clearStatusAfter = (ms) => {
    setTimeout(
      () => {
        setStatusMessage("");
        setStatusClass("");
      },
      ms ? ms : 5000
    );
  };

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

  const handleMemberId = (e) => {
    setMemberId(e.target.value);
  };

  const handleManagerId = (e) => {
    setManagerId(e.target.value);
  };

  const updateCreateStatus = (success, login, err) => {
    if (success) {
      setStatusClass("success");
      setStatusMessage(`Successfully created user ${login}.`);
      clearCreateVals();
    } else {
      setStatusClass("fail");
      setStatusMessage(
        err ? `Error: ${err}.` : `Error: could not create user ${login}.`
      );
    }
    props.setEditsMade(!props.editsMade);
    clearStatusAfter();
  };

  const createUser = (e) => {
    if (
      firstName &&
      lastName &&
      login &&
      email &&
      memberId &&
      managerId &&
      authState.isAuthenticated
    ) {
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
            login: login,
            memberId: memberId,
            managerId: managerId
          }
        });

        const options = {
          method,
          headers,
          body
        };

        fetch(`${users_endpoint}/?activate=false`, options)
          .then((res) => {
            if (res.status === 200) {
              return "OK";
            } else {
              return res.json();
            }
          })
          .then((data) => {
            if (data === "OK") {
              updateCreateStatus(true, login);
            } else if (data.errorCode === "E0000001") {
              updateCreateStatus(
                false,
                login,
                `${data.errorCode}: This username already exists`
              );
            } else {
              updateCreateStatus(
                false,
                login,
                `${data.erroCode}: ${data.errorSummary}`
              );
            }
          })
          .catch((err) => updateCreateStatus(false, login, err));
      }
    } else {
      updateCreateStatus(false, login, "Please fill in all fields");
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
        .then((data) => {
          setUsers(data);
          data.forEach((user) => {
            getUserGroups(user["id"]);
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const updateDeleteStatus = (success, login, err) => {
    if (success) {
      setStatusClass("success");
      setStatusMessage(`Successfully deleted user ${login}.`);
    } else {
      setStatusClass("fail");
      setStatusMessage(
        err ? `Error: ${err}` : `Error: could not delete user ${login}.`
      );
    }
    clearStatusAfter();
    props.setEditsMade(!props.editsMade);
  };

  const deleteUser = (userId, login) => {
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
        `Are you sure you want to delete user ${login}?`
      );
      if (okToDelete) {
        fetch(`${users_endpoint}/${userId}`, options)
          .then((res) => res.text())
          .then((data) => {
            // run again to delete perm
            fetch(`${users_endpoint}/${userId}`, options)
              .then((res) => res.text())
              .then((data) => updateDeleteStatus(true, login))
              .catch((err) => updateDeleteStatus(false, login, err));
          });
      }
    }
  };

  const updateUser = (event, userId) => {
    let parent = document.getElementById(userId);

    parent.querySelectorAll(".user-input").forEach((input) => {
      input.removeAttribute("readonly");
      input.setAttribute("style", "background:yellow");
    });

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

  const cancelCreateUser = () => {
    clearCreateVals();
  };

  const updateSaveStatus = (success, login, err) => {
    if (success) {
      setStatusClass("success");
      setStatusMessage(
        `Successfully updated profile information for user ${login}.`
      );
    } else {
      setStatusClass("fail");
      setStatusMessage(
        err
          ? `Error: ${err}`
          : `Error: could not update profile information for ${login}.`
      );
    }
    props.setEditsMade(!props.editsMade);
    clearStatusAfter();
  };

  const saveUpdate = (userId) => {
    let parent = document.getElementById(userId);
    const userInputs = Array.from(parent.querySelectorAll(".user-input"));
    if (!userInputs.every((input) => input.value.length > 0)) {
      alert("Fill in all fields please.");
    } else {
      const memberId = userInputs[0].value;
      const managerId = userInputs[1].value;
      const firstName = userInputs[2].value;
      const lastName = userInputs[3].value;
      const email = userInputs[4].value;
      const login = userInputs[5].value;
      // console.log(userInputs);
      const okToSave = window.confirm(
        `Are you sure you want to save changes for user ${login}?`
      );
      if (okToSave) {
        parent.querySelectorAll(".user-input").forEach((input) => {
          input.setAttribute("readonly", "");
          input.removeAttribute("style");
        });

        parent.querySelector(".user-delete-btn").removeAttribute("hidden");
        parent.querySelector(".user-save-btn").setAttribute("hidden", "");
        parent
          .querySelector(".user-cancel-save-btn")
          .setAttribute("hidden", "");
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
              memberId: memberId,
              managerId: managerId,
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
              updateSaveStatus(true, login);
            })
            .catch((err) => updateSaveStatus(false, login, err));
        }
      }
    }
  };

  const getUserGroups = (userId) => {
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
          let groups =
            '<ol id="user-form-user-groups">' +
            data.map((obj) => `<li>${obj["profile"]["name"]}</li>`).join("\n") +
            "</ol>";
          groupTd.innerHTML = groups;
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUsers();
  }, [oktaAuth, props.editsMade]);

  const toggleButtons = () => {
    const viewButton = document.getElementById("view-users-button");
    const createButton = document.getElementById("create-user-button");

    const viewBg = !viewUsers ? "#117a8b" : "none";
    const createBg = viewUsers ? "#1e7e34" : "none";

    viewButton.setAttribute("style", `background:${viewBg}`);
    createButton.setAttribute("style", `background:${createBg}`);

    clearCreateVals();
  };

  const viewUsersClicked = () => {
    const viewTableContainer = document.getElementById("users-table-container");
    const createUsersContainer = document.getElementById("create-form");
    if (!viewUsers) {
      viewTableContainer.setAttribute("style", "display: block");
      createUsersContainer.setAttribute("style", "display:none");
      toggleButtons();
      setViewUsers(!viewUsers);
    }
  };

  const createUsersClicked = () => {
    const viewTableContainer = document.getElementById("users-table-container");
    const createUsersContainer = document.getElementById("create-form");
    if (viewUsers) {
      viewTableContainer.setAttribute("style", "display:none; ");
      createUsersContainer.setAttribute(
        "style",
        "display:flex; flex-direction:column;"
      );
      toggleButtons();
      setViewUsers(!viewUsers);
    }
  };

  return (
    <div id='user-form-container'>
      <h2 id='user-form-title'>User Management</h2>
      <div id='crud-button-users'>
        <button
          id='view-users-button'
          className='btn btn-info'
          onClick={viewUsersClicked}
        >
          View Users
        </button>

        <button
          id='create-user-button'
          className='btn btn-success'
          onClick={createUsersClicked}
        >
          Create New User
        </button>
      </div>
      <div id='user-status-message' className={statusClass}>
        {statusMessage}
      </div>
      <div id='users-table-container'>
        <table>
          <thead>
            <tr>
              <th></th>
              {/* <th>User ID</th> */}
              <th>Member ID</th>
              <th className='borders'>Manager ID</th>
              <th className='borders'>First Name</th>
              <th className='borders'>Last Name </th>
              <th className='borders'>Email</th>
              <th className='borders'>Login Username</th>
              <th>Groups</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              users.map((user) => {
                return (
                  <tr key={user["id"]} id={user["id"]}>
                    <td>
                      <button
                        className='user-update-btn user-btn btn btn-primary'
                        onClick={(event) => updateUser(event, user["id"])}
                      >
                        Update User
                      </button>
                    </td>
                    {/* <td className='user-data-td'>{user["id"]}</td> */}
                    <td className='user-data-td'>
                      <input
                        className='user-input memberId form-control'
                        type='text'
                        defaultValue={user["profile"]["memberId"]}
                        readOnly
                      />
                    </td>
                    <td className='user-data-td borders'>
                      <input
                        className='user-input managerId form-control'
                        type='text'
                        defaultValue={user["profile"]["managerId"]}
                        readOnly
                      />
                    </td>
                    <td className='borders user-data-td'>
                      <input
                        className='user-input firstName form-control'
                        type='text'
                        defaultValue={user["profile"]["firstName"]}
                        readOnly
                      />
                    </td>
                    <td className='borders user-data-td'>
                      <input
                        className='user-input lastName form-control'
                        type='text'
                        defaultValue={user["profile"]["lastName"]}
                        readOnly
                      />
                    </td>
                    <td className='borders user-data-td'>
                      <input
                        className='user-input email form-control'
                        type='text'
                        defaultValue={user["profile"]["email"]}
                        readOnly
                      />
                    </td>
                    <td className='borders user-data-td'>
                      <input
                        className='user-input login form-control'
                        type='text'
                        defaultValue={user["profile"]["login"]}
                        readOnly
                      />
                    </td>

                    <td className='user-groups user-data-td'>
                      {"Loading groups..."}
                    </td>

                    <td>
                      {
                        <button
                          className='user-delete-btn user-btn btn btn-danger'
                          onClick={() =>
                            deleteUser(user["id"], user["profile"]["login"])
                          }
                        >
                          Delete User
                        </button>
                      }
                      {
                        <button
                          className='user-save-btn user-btn btn btn-success'
                          hidden
                          onClick={() => saveUpdate(user["id"])}
                        >
                          Save
                        </button>
                      }
                      {
                        <button
                          className='user-cancel-save-btn user-btn btn btn-danger'
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
      <div id='create-form'>
        <label className='create-user-label'>
          First Name:
          <input
            onChange={handleFN}
            placeholder='Enter a first name'
            id='first-name-input'
          />
        </label>
        <label className='create-user-label'>
          Last Name:
          <input
            onChange={handleLN}
            placeholder='Enter a last name'
            id='last-name-input'
          />
        </label>
        <label className='create-user-label'>
          Email:
          <input
            onChange={handleEmail}
            placeholder='Enter a valid email address'
            id='email-input'
          />
        </label>
        <label className='create-user-label'>
          Username:
          <input
            onChange={handleLogin}
            placeholder='Enter a login username'
            id='login-input'
          />
        </label>
        <label className='create-user-label'>
          Member ID:
          <input
            onChange={handleMemberId}
            placeholder='Enter a valid member ID'
            id='member-id-input'
          />
        </label>
        <label className='create-user-label'>
          Manager ID:
          <input
            onChange={handleManagerId}
            placeholder='Enter a valid manager ID'
            id='manager-id-input'
          />
        </label>
        <button
          onClick={createUser}
          id='create-user-btn'
          className='btn btn-primary user-btn'
        >
          Create User
        </button>
        <button
          id='cancel-user-create-btn'
          className='btn btn-danger user-btn'
          onClick={cancelCreateUser}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserForm;
