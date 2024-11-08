import React from 'react';
// import { Paper, Avatar, Typography, Box } from '@mui/material';
import './LeaderboardCard.css';


const LeaderboardCard = ({ rank, username, score, avatar }) => {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#2c3e50'; // Default color
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 1,
        },
        borderLeft: rank <= 3 ? `4px solid ${getRankColor(rank)}` : 'none',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: getRankColor(rank),
            fontWeight: 'bold',
          }}
        >
          {rank}
        </Typography>
      </Box>

      <Avatar
        src={avatar || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='}
        alt={username}
        sx={{ width: 40, height: 40 }}
      />

      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          fontWeight: 500,
        }}
      >
        {username}
      </Typography>

      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {score}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          points
        </Typography>
      </Box>
    </Paper>
  );
};

export default LeaderboardCard;
