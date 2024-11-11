const FriendRequests = ({ userData, handleAddFriend, handleDecline }) => {
    return (
        <div className='friend-requests'>
            <h2>Friend Requests</h2>
            {userData.friendRequests ? (
                userData.friendRequests.map((request) => (
                    <div key={request._id} className='request-card'>
                        <h3>{request.firstName} {request.lastName}</h3>
                        <hr />
                        <div className='request-actions'>
                            <button onClick={() => handleAddFriend(request)} className="accept-request">
                                Accept Friend Request
                            </button>
                            <button onClick={() => handleDecline(request)} className="decline-request">
                                Decline Friend Request
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No friend requests yet...</p>
            )}
        </div>
    );
}

export default FriendRequests; 