import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function Gameplay() {
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
    section: {
      backgroundColor: theme.colors.background,
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '4px',
      color: theme.colors.text,
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Gameplay</h2>
      <div style={styles.section}>Question Display</div>
      <div style={styles.section}>Timer</div>
      <div style={styles.section}>Opponent Info</div>
    </div>
  );
}

export default Gameplay;
