import React from 'react';
// import { Container, Typography, Box, Paper } from '@mui/material';
import LeaderboardCard from './LeaderboardCard';
import './Leaderboard.css';

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, username: "Player1", score: 1000, avatar: null },
    { rank: 2, username: "Player2", score: 900, avatar: null },
    { rank: 3, username: "Player3", score: 800, avatar: null },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Leaderboard
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {leaderboardData.map((player) => (
              <LeaderboardCard
                key={player.rank}
                rank={player.rank}
                username={player.username}
                score={player.score}
                avatar={player.avatar}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Leaderboard; 