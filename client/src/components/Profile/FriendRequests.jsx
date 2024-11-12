const FriendRequests = ({ userData, handleAddFriend, handleDecline }) => {
    return (
        <div className="friend-requests-container">
            <div className="friend-requests-header">
                <h2>Friend Requests</h2>
            </div>
            
            {userData.friendRequests && userData.friendRequests.length > 0 ? (
                <div className="friend-requests-list">
                    {userData.friendRequests.map((request) => (
                        <div key={request._id} className="friend-request-item">
                            <span className="friend-name" style={{
                                color: 'black'
                            }}>{request.firstName} {request.lastName}</span>
                            <div className="friend-actions">
                                <button 
                                    className="accept-button"
                                    onClick={() => handleAddFriend(request)}
                                >
                                    Accept
                                </button>
                                <button 
                                    className="decline-button"
                                    onClick={() => handleDecline(request)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-requests-message">
                    No friend requests
                </div>
            )}
        </div>
    );
};

export default FriendRequests; 