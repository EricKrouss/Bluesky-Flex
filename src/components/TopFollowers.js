// src/components/TopFollowers.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TopFollowers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersMap = new Map();
        const searchTerms = ["a", "e", "i", "o", "u"];

        const apiBaseUrl = "https://public.api.bsky.app";

        // Step 1: Fetch all search results in parallel
        const searchPromises = searchTerms.map((term) =>
          axios.get(`${apiBaseUrl}/xrpc/app.bsky.actor.searchActors`, {
            params: {
              term,
              limit: 100,
            },
          })
        );

        const searchResponses = await Promise.all(searchPromises);

        // Step 2: Combine and de-duplicate users
        searchResponses.forEach((response) => {
          const users = response.data.actors;
          users.forEach((user) => {
            if (!usersMap.has(user.did)) {
              usersMap.set(user.did, user);
            }
          });
        });

        let usersList = Array.from(usersMap.values());

        // Limit the number of users to fetch profiles for
        const MAX_USERS = 200;
        usersList = usersList.slice(0, MAX_USERS);

        // Step 3: Fetch detailed profiles for these users in parallel
        const profilePromises = usersList.map(async (user) => {
          try {
            const profileResponse = await axios.get(
              `${apiBaseUrl}/xrpc/app.bsky.actor.getProfile`,
              {
                params: {
                  actor: user.handle,
                },
              }
            );
            return { ...user, ...profileResponse.data };
          } catch (err) {
            console.error(`Error fetching profile for ${user.handle}:`, err);
            return user; // Return the user without profile data
          }
        });

        const usersWithProfiles = await Promise.all(profilePromises);

        // Step 4: Sort users by followersCount in descending order
        usersWithProfiles.sort(
          (a, b) => (b.followersCount || 0) - (a.followersCount || 0)
        );

        // Step 5: Take top 20 users
        const topUsersList = usersWithProfiles.slice(0, 20);

        setTopUsers(topUsersList);
      } catch (err) {
        console.error("Error fetching top users:", err);
        setError("Failed to fetch top users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="tf-container">
      <h1 className="tf-title">Top Followers</h1>
      {error && <p className="tf-error">{error}</p>}

      {loading ? (
        <div className="tf-user-list">
          <div className="tf-user-card">
            <div className="tf-user-rank">#</div>
            <img
              src="https://via.placeholder.com/150"
              alt="Loading avatar"
              className="tf-user-avatar"
            />
            <h2 className="tf-user-name">Loading...</h2>
            <p className="tf-user-handle">@loading</p>
            <p className="tf-user-followers">Followers: Loading...</p>
            <p className="tf-user-posts">Posts: Loading...</p>
          </div>
        </div>
      ) : (
        <div className="tf-user-list">
          {topUsers.map((user, index) => (
            <a
              href={`https://bsky.app/profile/${user.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tf-user-card-link"
              key={user.did}
            >
              <div className="tf-user-card">
                <div className="tf-user-rank">
                  #{index + 1}{" "}
                  {index === 0 && (
                    <span role="img" aria-label="crown">
                      👑
                    </span>
                  )}
                </div>
                <img
                  src={user.avatar || "https://via.placeholder.com/150"}
                  alt={`${user.displayName || user.handle}'s avatar`}
                  className="tf-user-avatar"
                />
                <h2 className="tf-user-name">
                  {user.displayName || user.handle}
                </h2>
                <p className="tf-user-handle">@{user.handle}</p>
                <p className="tf-user-followers">
                  Followers: {user.followersCount ?? "N/A"}
                </p>
                <p className="tf-user-posts">
                  Posts: {user.postsCount ?? "N/A"}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopFollowers;