import './FriendsList.css';

const FriendsList = ({ userData, handleRemoveFriend, navigate }) => {
    return (
        <div className="friends-container">
            <div className="friends-list-header">
                <h2>Friends List</h2>
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