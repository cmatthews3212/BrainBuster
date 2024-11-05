import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="homepage">
      {/* Sidebar */}
      <div className="sidebar">
        <Link to="/avatars" className="sidebar-item">
          <div className="sidebar-icon">🧑</div>
          <span className="sidebar-title">Avatar</span>
        </Link>
        <Link to="/themes" className="sidebar-item">
          <div className="sidebar-icon">🎨</div>
          <span className="sidebar-title">Themes</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="logo">
            <img src="/assets/logo.png" alt="Logo" width="40" height="40" />
          </div>
          <h1 className="app-title">BrainBuster</h1>
          <div className="navigation">
            <Link to="/home" className="nav-item">Home</Link>
            <Link to="/profile" className="nav-item">Profile</Link>
            <Link to="/leaderboard" className="nav-item">Leaderboard</Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Welcome, Player Name!</h2>
            <p className="hero-description">Rank: #1</p>
            <div className="hero-buttons">
              <button className="primary-button">Play Game</button>
              <button className="secondary-button">Customize Avatar</button>
            </div>
          </div>
          <img src="/assets/hero-image.jpg" alt="Hero" className="hero-image" />
        </div>

        {/* Rewards Section */}
        <div className="rewards-section">
          <h2 className="rewards-title">Rewards</h2>
          <div className="rewards-container">
            <div className="reward-card">
              <div className="reward-image-container">
                <div className="reward-image rewards-image-placeholder"></div>
              </div>
              <div className="reward-content">
                <h3 className="reward-title">Avatar Upgrade</h3>
                <p className="reward-subtitle">Unlocked by Winning 5 Games</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-container">
            <h2 className="stats-title">Top Players</h2>
            <p className="stats-description">See how you rank against the best!</p>
            <div className="stats-list">
              <div className="stats-row">
                <div className="stat-card">
                  <p>Player 1 - Score: 500</p>
                </div>
                <div className="stat-card">
                  <p>Player 2 - Score: 450</p>
                </div>
                <div className="stat-card">
                  <p>Player 3 - Score: 400</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
