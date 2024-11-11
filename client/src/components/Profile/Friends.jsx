import React from 'react';
import './Friends.css';

function PlayerProfiles() {
  return (
    <div className="profiles-container">
      <h2 className="profiles-title">Player Profiles</h2>
      <div className="profiles-grid">
        {/* Example profile cards - replace with actual data */}
        <div className="profile-card">
          <div className="profile-avatar">
            <img src="https://via.placeholder.com/100" alt="Player avatar" />
            <div className="online-status online"></div>
          </div>
          <h3 className="profile-name">Player One</h3>
          <p className="profile-status">Online</p>
          <button className="profile-action-btn">View Profile</button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <img src="https://via.placeholder.com/100" alt="Player avatar" />
            <div className="online-status offline"></div>
          </div>
          <h3 className="profile-name">Player Two</h3>
          <p className="profile-status">Last seen 2h ago</p>
          <button className="profile-action-btn">View Profile</button>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfiles;
