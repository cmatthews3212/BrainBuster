import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JoinGame from '../components/JoinGame';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, QUERY_USERS } from '../utils/queries';
import socket from '../socket';
import { useTheme } from './ThemeContext.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [showGameOptions, setShowGameOptions] = useState(false);
  const { theme } = useTheme();
  const [inviteReceived, setInviteReceived] = useState(false);
  const [invitingPlayer, setInvitingPlayer] = useState(null);
  const [gameId, setGameId] = useState(null)
  const [inviteName, setInviteName] = useState(null) 
  const { loading, error, data } = useQuery(GET_ME);
  const [authenticated, setAuthenticated] = useState(false);
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(QUERY_USERS);

  const me = data?.me || {}
  console.log(me)
  console.log(socket)

  useEffect(() => {
    socket.connect();

    if (me._id && !authenticated) {
      socket.emit('authenticated', me._id);
      console.log(`Emitted 'authenticated' with user ID: ${me._id}`);
      setAuthenticated(true);
    }

    const handleInviteReceived = (gameData) => {
      const { gameId, inviterId, senderName } = gameData;
      setInviteReceived(true);
      setInvitingPlayer(inviterId);
      setGameId(gameId);
      setInviteName(senderName);
      console.log('Game invite received:', gameData);
    };

    socket.on('gameInviteReceived', handleInviteReceived);

    return () => {
      socket.off('gameInviteReceived', handleInviteReceived);
      socket.disconnect();
    };
  }, [me._id, authenticated])

  const handleCreateGame = () => {
    navigate('/create-game');
  };
  
  const handleJoinGame = () => {
    socket.emit('acceptGameInvite', {
      gameId,
      opponentId: invitingPlayer,
    })
    if (gameId){
      navigate(`/lobby/${gameId}`)
      
    } 
    
  }
  
  const handlePlay = () => {
    navigate('/home');
  };
  
  useEffect(() => {
    if (me._id) {
      socket.emit('authenticated', me._id);
      console.log(`Emitted 'authenticated' with user ID: ${me._id}`);
    }


    const handleInviteReceived = (gameData) => {
      const { gameId, inviterId, friendId, senderName } = gameData;
      
      if (friendId === me._id) {
        setInviteReceived(true);
        setInvitingPlayer(inviterId);
        setGameId(gameId);
        setInviteName(senderName)

      }
      
      
    }
    
    socket.on('gameInviteReceived', handleInviteReceived)
    
    return () => {
      socket.off('gameInviteReceived', handleInviteReceived)
    }
  }, [me._id])
  
  
  socket.on('connection', () => {
    console.log('Connected to the socket server');
    if (me._id) {
      socket.emit('authenticated', me._id);
    }
  });
  
  socket.on('gameInviteReceived', (data) => {
    console.log("game Invite", data)
  })
  
  const topThreePlayers = dataUsers.users.slice(0, 3);

  if (errorUsers) {
    console.error(errorUsers)
  }
  if (loadingUsers) {
    return <p>Loading...</p>
  }
  
  
  if (loading) {
    return <p>Loading...</p>
  }
  
  if (error ) {
    console.error(error)
  }

  if (!me.avatar) {
    navigate('/avatars')
  }
  
  
  
  
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main content - adjusted to account for navbar */}
      <div className="dashboard-container" style={{ 
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: '2rem',
        marginTop: '64px', // Add margin to account for navbar height
      }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ 
          backgroundColor: theme.colors.card,
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          height: 'fit-content'
        }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#F5F5F5',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              <img src={data.me.avatar.src}></img>
            </div>
            <h3 style={{ color: '#7E57C2', marginBottom: '0.5rem' }}>{data.me.firstName} {data.me.lastName}</h3>
            <p style={{ color: '#616161' }}>Rank: #1</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/avatars" style={{ 
              color: '#7E57C2',
              textDecoration: 'none',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span>🧑</span>
              <span>Customize Avatar</span>
            </Link>
            <Link 
              to="/themes" 
              style={{ 
                color: '#7E57C2',
                textDecoration: 'none',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <span>🎨</span>
              <span>Themes</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Game Section */}
          <div style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>{inviteName} has invited you to a game!</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => handleJoinGame(gameId)}
                style={{ 
                  backgroundColor: '#FF4081',
                  color: '#FFFFFF',
                  padding: '1rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  flex: '1',
                  maxWidth: '200px',
                  transition: 'transform 0.2s',
                  ':hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                PLAY
              </button>
            </div>

            {showGameOptions && (
              <div style={{ 
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <button 
                  onClick={handleCreateGame}
                  style={{ 
                    backgroundColor: '#FF4081',
                    color: '#FFFFFF',
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Create New Game
                </button>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>Top Players</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {topThreePlayers.map((player, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#F5F5F5',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FF4081',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <p style={{ color: '#7E57C2', fontWeight: '500' }}>{player.firstName} {player.lastName}</p>
                    <p style={{ color: '#616161' }}>Games Won: {player.stats.gamesWon}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Section */}
          <div style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>Recent Achievements</h2>
            <div style={{ 
              backgroundColor: '#F5F5F5',
              padding: '1.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#7E57C2',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🏆
              </div>
              <div>
                <h3 style={{ color: '#7E57C2', marginBottom: '0.5rem' }}>Avatar Upgrade</h3>
                <p style={{ color: '#616161' }}>Unlocked by Winning 5 Games</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
