import React, { useState } from "react";
import "./App.css";
import TopFollowers from "./components/TopFollowers";
import MostLikedPosts from "./components/MostLikedPosts";
import { ReactComponent as BlueskyIcon } from "./assets/bluesky.svg";
import { ReactComponent as GitHubIcon } from "./assets/github.svg";

const App = () => {
  const [selectedTab, setSelectedTab] = useState("followers");

  const renderContent = () => {
    switch (selectedTab) {
      case "followers":
        return <TopFollowers />;
      case "likedPosts":
        return <MostLikedPosts />;
      default:
        return <TopFollowers />;
    }
  };

  return (
    <div className="container">
      <h1>Bluesky Flex</h1>
      <h4>Made by Eric Krouss</h4>
       {/* Social Icons Section */}
       <div className="social-icons">
        <a
          href="https://bsky.app/profile/krouss.net" // Replace with your actual Bluesky profile URL
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bluesky Profile"
          title="Visit my Bluesky Profile"
        >
          <BlueskyIcon className="icon" />
        </a>
        <a
          href="https://github.com/EricKrouss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          title="Visit my GitHub Profile"
        >
          <GitHubIcon className="icon" />
        </a>
      </div>
      <div className="tabs-container">
  <button
    className={`tab-button ${selectedTab === 'followers' ? 'active' : ''}`}
    onClick={() => setSelectedTab('followers')}
  >
    Most Followers
  </button>
  <button
    className={`tab-button ${selectedTab === 'likedPosts' ? 'active' : ''}`}
    onClick={() => setSelectedTab('likedPosts')}
  >
    Most Liked Posts
  </button>
  {/* Add more buttons here for future toggles */}
</div>
      {renderContent()}
    </div>
  );
};

export default App;