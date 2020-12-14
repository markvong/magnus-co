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
  const [prep, setPrep] = useState("to");
  const [op, setOp] = useState("PUT");
  const [verb, setVerb] = useState("Add");
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
          let members = data
            .map((obj) => `<li>${obj["profile"]["login"]}</li>`)
            .join("\n");
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

  useEffect(() => {
    getUsersAndGroups();
  }, [oktaAuth]);

  return (
    <div>
      <h2>Group Management</h2>
      <div id="create-group-div">
        <input onChange={handleGroupName} placeholder="Enter a group name" />
        <input
          onChange={handleGroupDescr}
          placeholder="Enter a group description"
        />
        <button onClick={createGroup}>Create Group</button>
      </div>
      <div id="group-div">
        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Group Members</th>
            </tr>
          </thead>
          <tbody>
            {groups ? (
              groups.map((group) => {
                getGroupMembers(group["id"]);
                return (
                  <tr key={group["id"]} id={group["id"]}>
                    <td>{group["id"]}</td>
                    <td>{group["profile"]["name"]}</td>
                    <td className="group-members-td"></td>
                    <td>
                      <button
                        onClick={() =>
                          deleteGroup(group["id"], group["profile"]["name"])
                        }
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
      <div id="user-group-div">
        <select
          id="group-op-select"
          name="group-op-select"
          defaultValue="PUT"
          onChange={handleGroupOps}
        >
          <option value="PUT">Add</option>
          <option value="DELETE">Remove</option>
        </select>
        <label htmlFor="users">user</label>
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
        <label htmlFor="groups">{`${prep} group`}</label>
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
        {userId && groupId ? (
          <button
            onClick={() =>
              updateUserGroupMembership(op, groupId, userId, name, group)
            }
          >
            Submit
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
