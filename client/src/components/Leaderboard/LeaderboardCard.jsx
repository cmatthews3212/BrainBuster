import React from 'react';
import './LeaderboardCard.css';

const LeaderboardCard = ({ rank, username, score, avatar, stats }) => {
  
  return (
    <div className="leaderboard-card" style={{
      display: 'flex',
      justifyContent: 'space-around'
    }}>
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

      <div className="score-container" style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <span className="score">Games Won</span>
        <span className="points" style={{
          textAlign: 'center',
          margin: '0 auto',
          marginTop: '5px',
          fontWeight: 'bold'
        }}>{stats.gamesWon}</span>
      </div>
    </div>
  );
};

export default LeaderboardCard;
