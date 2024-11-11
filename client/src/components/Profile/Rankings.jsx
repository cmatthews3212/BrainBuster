import React from 'react';
import './Rankings.css';

function Rankings() {
  return (
    <div className="rankings">
      <h2 className="rankings-title">Leaderboard</h2>
      <div className="rankings-container">
        <div className="rankings-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Score</span>
        </div>
        <div className="rankings-list">
          <div className="ranking-item">
            <span className="rank">1</span>
            <span className="player">Player One</span>
            <span className="score">1000</span>
          </div>
          <div className="ranking-item">
            <span className="rank">2</span>
            <span className="player">Player Two</span>
            <span className="score">850</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rankings;
