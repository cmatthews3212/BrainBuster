import React from 'react';
import LeaderboardCard from './LeaderboardCard';
import './Leaderboard.css';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, QUERY_USERS } from '../../utils/queries';

const Leaderboard = () => {
  const { loading, error, data } = useQuery(QUERY_USERS);
  
  if (loading) return <p>loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error loading leaderboard</p>;
  }
  
  const usersArray = data.users;



  return (
    <div className="dashboard-container" style={{
      marginTop: '100px'
    }}>
      <div className="content-wrapper">
        <header className="dashboard-header">
          <h1>Leaderboard</h1>
          <p>See how you rank against other players!</p>
        </header>

        <div className="leaderboard-grid">
          {usersArray.map((player, index) => (
            <LeaderboardCard
              key={player._id}
              rank={index + 1}
              username={`${player.firstName} ${player.lastName}`}
              score={player.score}
              avatar={player.avatar?.src}
              stats={player.stats}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 