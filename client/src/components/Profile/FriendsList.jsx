import { Link } from 'react-router-dom';

const FriendsList = ({ userData, handleRemoveFriend, navigate }) => {
    return (
        <div className='friends-list'>
            <div className='friends-list-header'>
                <h2>Your Friends</h2>
                <button onClick={() => navigate('/find')} className="find-friends-btn">
                    Find Friends!
                </button>
            </div>
            <div className='friends-grid'>
                {userData?.friends ? (
                    userData.friends.map((friend) => (
                        <div key={friend._id} className='friend-card'>
                            <h3>{friend.firstName} {friend.lastName}</h3>
                            <hr />
                            <div className='friend-actions'>
                                <Link className='view-friend' to={`/profile/${friend._id}`}>
                                    View Friend
                                </Link>
                                <button className="remove-friend" onClick={() => handleRemoveFriend(friend)}>
                                    Remove Friend
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No friends found...</p>
                )}
            </div>
        </div>
    );
}

export default FriendsList; 