import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, [Player Name]</h2>
      </header>
      <button>Start Game</button>
      <button>Invite Friends</button>
      <button>View Rankings</button>
      <section>Recent Stats</section>
      <section>News & Updates</section>
    </div>
  );
}

export default Dashboard;
