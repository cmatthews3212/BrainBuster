import React from 'react';
import { Paper, Avatar, Typography, Box } from '@mui/material';
import './LeaderboardCard.css';
import Dashboard from '../../pages/Dashboard';


const LeaderboardCard = ({ rank, username, score, avatar }) => {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(45deg, #FFD700, #FFA500)'; // Gold gradient
      case 2:
        return 'linear-gradient(45deg, #C0C0C0, #A9A9A9)'; // Silver gradient
      case 3:
        return 'linear-gradient(45deg, #CD7F32, #B87333)'; // Bronze gradient
      default:
        return 'linear-gradient(45deg, #2c3e50, #3498db)'; // Default gradient
    }
  };

  console.log({avatar})

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        borderRadius: 4,
        bgcolor: 'background.paper',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        '&:hover': {
          transform: 'translateY(-3px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
        },
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #f9f9f9, #e9ecef)',
          boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            background: getRankColor(rank),
            backgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold',
          }}
        >
          {rank}
        </Typography>
      </Box>

      <Avatar
        src={avatar}
        alt={username}
        sx={{ width: 60, height: 60 }}
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
