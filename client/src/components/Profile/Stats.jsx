import React from 'react';
import './Stats.css';

function Stats() {
  return (
    <div className="stats-container">
      <h2 className="stats-title">Game Statistics</h2>
      <div className="stats-section">
        <h3>Overall Stats</h3>
        {/* Stats content will go here */}
      </div>
      <div className="stats-section">
        <h3>Player-Specific Stats</h3>
        {/* Stats content will go here */}
      </div>
    </div>
  );
}

export default Stats;
