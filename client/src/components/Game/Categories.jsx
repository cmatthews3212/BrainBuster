import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function QuestionDatabase() {
  const { theme } = useTheme();

  const styles = {
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: '8px',
      padding: '20px',
      margin: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    heading: {
      color: theme.colors.primary,
      marginBottom: '20px',
    },
    button: {
      backgroundColor: theme.colors.primary,
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '15px',
      '&:hover': {
        backgroundColor: theme.colors.secondary,
      },
    },
    list: {
      padding: '15px',
      backgroundColor: theme.colors.background,
      borderRadius: '4px',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Question Database</h2>
      <div style={styles.list}>Question List</div>
      <button style={styles.button}>Add New Question</button>
    </div>
  );
}

export default QuestionDatabase;
