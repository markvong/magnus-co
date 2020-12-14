import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";

export default (props) => {
  const { authState, oktaAuth } = useOktaAuth();

  const [users, setUsers] = useState(null);
  const [groups, setGroups] = useState(null);
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");

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

  const addUserToGroup = async (groupId, userId, name, group) => {
    const okToAdd = window.confirm(`Add ${name} to ${group} group?`);
    if (okToAdd) {
      if (authState.isAuthenticated) {
        const accessToken = authState.accessToken["value"];
        const headers = new Headers();
        const method = "PUT";
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
    }
  };

  const updateUserId = (event) => {
    setName(event.target.options[event.target.selectedIndex].text);
    setUserId(event.target.value);
  };

  const updateGroupId = (event) => {
    setGroup(event.target.options[event.target.selectedIndex].text);
    setGroupId(event.target.value);
  };

  useEffect(() => {
    getUsersAndGroups();
  }, [oktaAuth]);

  return (
    <div>
      <h2>Group Management</h2>
      <label htmlFor="users">Add user</label>
      <select
        id="user-select"
        name="users"
        onChange={updateUserId}
        value={userId}
      >
        <option value="">Select a User</option>
        {users
          ? users.map((user) => (
              <option
                value={user["id"]}
                key={user["id"]}
              >{`${user["profile"]["firstName"]} ${user["profile"]["lastName"]}`}</option>
            ))
          : "Loading users..."}
      </select>
      <label htmlFor="groups">to group</label>
      <select
        id="group-select"
        name="groups"
        onChange={updateGroupId}
        value={groupId}
      >
        <option value="">Select a Group</option>
        {groups
          ? groups.map((group) => (
              <option value={group["id"]} key={group["id"]}>
                {group["profile"]["name"]}
              </option>
            ))
          : "Loading groups.."}
      </select>
      <button onClick={() => addUserToGroup(groupId, userId, name, group)}>
        Submit
      </button>
    </div>
  );
};
