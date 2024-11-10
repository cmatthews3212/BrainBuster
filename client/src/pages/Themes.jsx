import React from 'react';
import { useTheme } from './ThemeContext';

function Themes() {
  console.log('Themes component rendering');
  const { currentTheme, setCurrentTheme, theme, themes } = useTheme();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <div style={{ 
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: '2rem',
        marginTop: '64px'
      }}>
        <div style={{ 
          backgroundColor: theme.colors.card,
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: theme.colors.primary, marginBottom: '1.5rem' }}>
            Choose Your Theme
          </h2>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(themes).map(([themeKey, themeValue]) => (
              <button
                key={themeKey}
                onClick={() => setCurrentTheme(themeKey)}
                style={{
                  backgroundColor: themeValue.colors.card,
                  border: `2px solid ${currentTheme === themeKey ? 
                    theme.colors.secondary : 
                    'transparent'
                  }`,
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <h3 style={{ color: themeValue.colors.primary }}>
                  {themeValue.name}
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  {Object.values(themeValue.colors).map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: color,
                        borderRadius: '50%',
                        border: '1px solid #ddd'
                      }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Themes; 