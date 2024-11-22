import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  // Function to fetch user profile data
  const fetchUserData = async () => {
    setError(""); // Reset error message
    setUserData(null); // Clear previous data

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    try {
      // Step 1: Fetch user profile to get the DID
      const profileResponse = await axios.get(
        "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile",
        {
          params: { actor: username }, // Use the handle or DID
        }
      );

      const {
        displayName,
        createdAt,
        handle,
        did,
        followersCount,
        followsCount,
        postsCount,
      } = profileResponse.data;

      // Step 2: Query SkyZoo for the join number
      const skyZooResponse = await axios.get(
        `https://skyzoo.blue/stats/plc/${did}`
      );

      const { joinNumber } = skyZooResponse.data;

      // Update the user data state
      setUserData({
        displayName,
        username: handle,
        joinDate: new Date(createdAt).toLocaleDateString(),
        joinNumber, // Fetched from SkyZoo
        followers: followersCount,
        following: followsCount,
        posts: postsCount,
      });
    } catch (err) {
      setError("Unable to fetch user details. Please check the username.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Bluesky User Info</h1>
      <input
        type="text"
        placeholder="Enter username (e.g., john.bsky.social)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <br />
      <button
        onClick={fetchUserData}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Fetch User Info
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {userData && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h2>User Details</h2>
          <p><strong>Display Name:</strong> {userData.displayName}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Join Number:</strong> {userData.joinNumber}</p>
          <p><strong>Join Date:</strong> {userData.joinDate}</p>
          <p><strong>Followers:</strong> {userData.followers}</p>
          <p><strong>Following:</strong> {userData.following}</p>
          <p><strong>Posts:</strong> {userData.posts}</p>
        </div>
      )}
    </div>
  );
};

export default App;