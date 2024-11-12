import './FriendsList.css';
import { useNavigate } from 'react-router-dom';

const FriendsList = ({ userData, handleRemoveFriend, navigate }) => {
    const navigateFriends = useNavigate();
    const renderFriends = () => {
        navigateFriends('/find')
    }
    return (
        <div className="friends-container">
            <div className="friends-list-header">
                <h2>Friends List</h2>
                <button onClick={renderFriends}
                style={{
                    backgroundColor: '#FF4081',
                    border: 'none',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '50px',
                    fontWeight: 'bold'

                }}>Find Friends</button>
            </div>
            
            {userData.friends && userData.friends.length > 0 ? (
                <div className="friends-list">
                    {userData.friends.map((friend) => (
                        <div key={friend._id} className="friend-item">
                            <span className="friend-name">
                                {friend.firstName} {friend.lastName}
                            </span>
                            <div className="friend-actions">
                                <button 
                                    className="friend-button view-button"
                                    onClick={() => navigate(`/profile/${friend._id}`)}
                                >
                                    View
                                </button>
                                <button 
                                    className="friend-button remove-button"
                                    onClick={() => handleRemoveFriend(friend)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-friends-message">
                    No friends added yet
                </div>
            )}
        </div>
    );
};

export default FriendsList; 