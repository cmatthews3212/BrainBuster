import React, { createContext, useContext, useState, useEffect } from 'react';

// Define themes object directly in this file
const themes = {
  default: {
    name: 'Default',
    colors: {
      background: '#A7FFEB',
      primary: '#7E57C2',
      secondary: '#FF4081',
      card: '#FFFFFF',
      text: '#616161',
      buttonBg: '#F5F5F5',
    }
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      background: '#121212',
      primary: '#BB86FC',
      secondary: '#03DAC6',
      card: '#1E1E1E',
      text: '#FFFFFF',
      buttonBg: '#2D2D2D',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      background: '#E3F2FD',
      primary: '#1976D2',
      secondary: '#00BCD4',
      card: '#FFFFFF',
      text: '#0D47A1',
      buttonBg: '#BBDEFB',
    }
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('userTheme');
    return savedTheme || 'default';
  });

  useEffect(() => {
    localStorage.setItem('userTheme', currentTheme);
  }, [currentTheme]);

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);