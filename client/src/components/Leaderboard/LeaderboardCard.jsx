import React from 'react';
import './LeaderboardCard.css';

const LeaderboardCard = ({ rank, username, score, avatar }) => {
  return (
    <div className="leaderboard-card">
      <div className="rank-container">
        <span className="rank">{rank}</span>
      </div>

      <img 
        className="avatar"
        src={avatar || '/default-avatar.png'} 
        alt={username}
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />

      <div className="user-info">
        <h3 className="username">{username}</h3>
      </div>

      <div className="score-container">
        <span className="score">{score}</span>
        <span className="points">points</span>
      </div>
    </div>
  );
};

export default LeaderboardCard;
