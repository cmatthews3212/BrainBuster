import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../pages/ThemeContext';

function JoinGame() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const styles = {
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: '8px',
      padding: '20px',
      margin: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      color: '#fff',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: theme.colors.secondary,
      },
    },
    inviteButton: {
      backgroundColor: theme.colors.secondary,
      color: '#fff',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: theme.colors.primary,
      },
    }
  };

  const renderQuiz = () => {
    return navigate('/quiz')
  }

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={renderQuiz}>JOIN!</button>
      <button style={styles.inviteButton}>INVITE!</button>
    </div>
  );
}

export default JoinGame;
