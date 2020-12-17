import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import "./GroupForm.css";

export default (props) => {
  const { authState, oktaAuth } = useOktaAuth();

  const [users, setUsers] = useState(null);
  const [groups, setGroups] = useState(null);
  const [localGroups, setLocalGroups] = useState(null);
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [prep, setPrep] = useState("to");
  const [op, setOp] = useState("");
  const [verb, setVerb] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescr, setGroupDescr] = useState("");

  const users_endpoint = "https://dev-8181045.okta.com/api/v1/users";
  const groups_endpoint = "https://dev-8181045.okta.com/api/v1/groups";

  const getUsersAndGroups = async () => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
      // get users
      fetch(users_endpoint, options)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.log(err));

      //get groups
      fetch(groups_endpoint, options)
        .then((res) => res.json())
        .then((data) => setGroups(data))
        .catch((err) => console.log(err));
    }
  };

  const updateUserGroupMembership = async (
    op,
    groupId,
    userId,
    name,
    group
  ) => {
    const okToAdd = window.confirm(`${verb} ${name} ${prep} ${group} group?`);
    if (okToAdd) {
      if (op && groupId && userId) {
        if (authState.isAuthenticated) {
          const accessToken = authState.accessToken["value"];
          const headers = new Headers();
          const method = op;
          headers.append("Authorization", `Bearer ${accessToken}`);
          headers.append("Content-Type", "application/json");
          const options = {
            method,
            headers
          };
          fetch(`${groups_endpoint}/${groupId}/users/${userId}`, options)
            .then((res) => res.text())
            .then((data) => window.location.reload())
            .catch((err) => console.log(err));
        }
      } else {
        alert("Make sure a value is selected for each input.");
      }
    }
  };
  const refreshComponents = () => {
    const opInput = document.getElementById("group-op-select");
    const userInput = document.getElementById("user-select");
    const groupInput = document.getElementById("group-select");

    opInput.contentWindow.location.reload();
  };
  const updateUserId = (event) => {
    setName(event.target.options[event.target.selectedIndex].text);
    setUserId(event.target.value);
  };

  const getUserGroups = () => {
    if (op === "DELETE" && userId && authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const method = "GET";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      };
      const options = {
        method,
        headers
      };
      fetch(`${users_endpoint}/${userId}/groups`, options)
        .then((res) => res.json())
        .then((data) => setLocalGroups(data))
        .catch((err) => console.log(err));
    }
  };

  const updateGroupId = (event) => {
    setGroup(event.target.options[event.target.selectedIndex].text);
    setGroupId(event.target.value);
  };

  const handleGroupOps = (event) => {
    setOp(event.target.value);
    setPrep(event.target.value === "PUT" ? "to" : "from");
    setVerb(event.target.options[event.target.selectedIndex].text);
  };

  const getGroupMembers = (groupId) => {
    if (authState.isAuthenticated) {
      const accessToken = authState.accessToken["value"];
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      fetch(`${groups_endpoint}/${groupId}/users`, options)
        .then((res) => res.json())
        .then((data) => {
          let parent = document.getElementById(groupId);
          let td = parent.querySelector(".group-members-td");
          let members =
            '<ol id="group-members-list">' +
            data
              .map((obj) => `<li>${obj["profile"]["login"]}</li>`)
              .join("\n") +
            "</ol>";
          td.innerHTML = members;
          // console.log(data);
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteGroup = (groupId, groupName) => {
    const okToDelete = window.confirm(`Delete group ${groupName}?`);
    if (okToDelete) {
      if (authState.isAuthenticated) {
        const accessToken = authState.accessToken["value"];
        const method = "DELETE";
        const options = {
          method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        };
        fetch(`${groups_endpoint}/${groupId}`, options)
          .then((res) => res.text())
          .then((data) => {
            console.log(data);
            window.location.reload();
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const createGroup = () => {
    const okToCreate = window.confirm(`Create group ${groupName}?`);
    if (okToCreate) {
      if (groupName.length > 0) {
        if (authState.isAuthenticated) {
          const accessToken = authState.accessToken["value"];
          const method = "POST";
          const body = JSON.stringify({
            profile: { name: groupName, description: groupDescr }
          });
          const options = {
            method,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`
            },
            body
          };

          fetch(`${groups_endpoint}`, options)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              window.location.reload();
            })
            .catch((err) => console.log(err));
        }
      } else {
        alert("Provide a valid group name");
      }
    }
  };

  const handleGroupName = (event) => {
    setGroupName(event.target.value);
  };

  const handleGroupDescr = (event) => {
    setGroupDescr(event.target.value);
  };

  const toggleView = (view, edit, add) => {
    const viewContainer = document.getElementById("group-table-container");
    const editContainer = document.getElementById("edit-group-users-container");
    const addContainer = document.getElementById("create-form-container");

    const viewDisplay = view ? "block" : "none";
    const editDisplay = edit ? "block" : "none";
    const addDisplay = add ? "block" : "none";
    viewContainer.setAttribute("style", `display:${viewDisplay}`);
    editContainer.setAttribute("style", `display:${editDisplay}`);
    addContainer.setAttribute("style", `display:${addDisplay}`);
  };

  const viewGroupsClicked = () => {
    toggleView(true, false, false);
  };

  const editGroupsClicked = () => {
    toggleView(false, true, false);
  };

  const createGroupsClicked = () => {
    toggleView(false, false, true);
  };

  const cancelCreateGroup = () => {
    const groupNameInput = document.getElementById("create-group-name-input");
    const groupDescrInput = document.getElementById("create-group-descr-input");
    groupNameInput.value = "";
    groupDescrInput.value = "";
    setGroupName("");
    setGroupDescr("");
  };

  useEffect(() => {
    getUsersAndGroups();
    getUserGroups(userId);
  }, [oktaAuth, userId, op, groupId]);

  return (
    <div id="group-form-container">
      <h2 id="group-form-title">Group Management</h2>
      <div id="crud-button-group">
        <button
          id="view-groups-button"
          className="btn btn-info"
          onClick={viewGroupsClicked}
        >
          View Groups
        </button>
        <button
          id="edit-groups-button"
          className="btn btn-primary"
          onClick={editGroupsClicked}
        >
          Edit Group
        </button>
        <button
          id="create-groups-button"
          className="btn btn-success"
          onClick={createGroupsClicked}
        >
          Create New Group
        </button>
      </div>

      <div id="group-table-container">
        <table id="groups-table">
          <thead>
            <tr>
              <th>Group ID</th>
              <th className="borders">Group Name</th>
              <th>Group Members</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {groups ? (
              groups.map((group) => {
                getGroupMembers(group["id"]);
                return (
                  <tr key={group["id"]} id={group["id"]}>
                    <td className="data-td">{group["id"]}</td>
                    <td className="data-td borders">
                      {group["profile"]["name"]}
                    </td>
                    <td className="group-members-td data-td"></td>
                    <td className="delete-group-btn-td">
                      <button
                        onClick={() =>
                          deleteGroup(group["id"], group["profile"]["name"])
                        }
                        className="btn btn-danger del-grp-btn"
                      >
                        Delete Group
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>
      </div>
      <div id="create-form-container">
        <input
          onChange={handleGroupName}
          placeholder="Enter a group name"
          id="create-group-name-input"
          className="form-control"
        />
        <textarea
          onChange={handleGroupDescr}
          placeholder="Enter a group description"
          id="create-group-descr-input"
          className="form-control"
        />
        <button
          onClick={createGroup}
          id="create-group-button"
          className="btn btn-primary"
        >
          Create Group
        </button>
        <button
          id="cancel-create-group-button"
          className="btn btn-warning"
          onClick={cancelCreateGroup}
        >
          Cancel
        </button>
      </div>
      <div id="edit-group-users-container">
        <select
          id="group-op-select"
          name="group-op-select"
          defaultValue=""
          onChange={handleGroupOps}
          className="form-control"
        >
          <option value="">Select Operation</option>
          <option value="PUT">Add</option>
          <option value="DELETE">Remove</option>
        </select>
        <label htmlFor="users">
          <span className="edit-static-text">user</span>
        </label>
        <select
          id="user-select"
          name="users"
          onChange={updateUserId}
          value={userId}
          className="form-control"
        >
          <option value="">Select a User</option>
          {users
            ? users.map((user) => (
                <option
                  value={user["id"]}
                  key={user["id"]}
                >{`${user["profile"]["email"]}`}</option>
              ))
            : "Loading users..."}
        </select>
        <label htmlFor="groups">
          <span className="edit-static-text">{`${prep} group`}</span>
        </label>
        <select
          id="group-select"
          name="groups"
          onChange={updateGroupId}
          value={groupId}
          className="form-control"
        >
          <option value="">Select a Group</option>
          {localGroups && op === "DELETE"
            ? localGroups.map((group) => (
                <option value={group["id"]} key={group["id"]}>
                  {group["profile"]["name"]}
                </option>
              ))
            : groups
            ? groups.map((group) => (
                <option value={group["id"]} key={group["id"]}>
                  {group["profile"]["name"]}
                </option>
              ))
            : "Loading groups.."}
        </select>

        <button
          onClick={() =>
            updateUserGroupMembership(op, groupId, userId, name, group)
          }
          id="edit-group-submit-btn"
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
