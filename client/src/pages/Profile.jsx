import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { UPDATE_AVATAR } from '../utils/mutations';
import { QUERY_USERS } from '../utils/queries';
import { REMOVE_FRIEND } from '../utils/mutations';
import { DECLINE_FRIEND_REQUEST } from '../utils/mutations';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth'
// this should have the "friends", "settings", and "rankings" as components

const Profile = () => {

    const navigate = useNavigate();
    
    const renderAvatarsPage = () => {
    navigate('/avatars')
}

   
const { loading, data } = useQuery(GET_ME);




const userData = data?.me || {}

// console.log(userData)

const [addFriend] = useMutation(ADD_FRIEND);



        
        



const [removeFriend] = useMutation(REMOVE_FRIEND);
const [declineFriendRequest] = useMutation(DECLINE_FRIEND_REQUEST);

const handleRemoveFriend = async (friend) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    
    if (!token) {
        return false;
    }
    
    try {
        const { data } = await removeFriend({
            variables: {userId: Auth.getProfile().data._id, friendId: friend._id},
             update: (cache) => {
                    cache.modify({
                        fields: {
                            friends(existingFriends = []) {
                                return existingFriends.filter(f => f._id !== friend._id)
                            }
                        }
                    })
            
                
            }
        });
        console.log('friend removed')
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}


const handleDecline = async (request) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    
    if (!token) {
        return false;
    }
    
    try {
        const { data } = await declineFriendRequest({
            variables: {
                userId: Auth.getProfile().data._id,
                friendId: request._id,
            
            }
        });
        console.log('friend removed')
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}


console.log(userData)
console.log(Auth.getProfile().data.lastName)

const handleAddFriend = async (friend) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
        return false;
    }

    try {
        const { data } = await addFriend({
            variables: {
                userId: Auth.getProfile().data._id,
                friendId: friend._id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                email: friend.email

            }
        });
        console.log('friend request sent')
        console.log(data)
    } catch (err) {
        console.error(err)
    }

    handleDecline(friend);
}






if (loading) {
    return <p>Loading Profile...</p>
}
                
return (
    
            <div className="profile">
        <div className='profile-head'>
        <h2>Hello, {userData.firstName || "User"}</h2>
        <div>

            {userData.avatar?.src ? (

            <>
        <img src={userData.avatar.src}></img>
        <button className="change-avatar-btn" onClick={renderAvatarsPage}>Change Avatar</button>
        </>
            ) : (
            <button className='change-avatar-btn' onClick={renderAvatarsPage}>Create Avatar</button>
            )}

        </div>

        </div>
        <div className='profile-info'>

        <div className='friends-container'>

            <div>

                <h2>Your Friends</h2>
                <button onClick={() => navigate('/find')}>Find Friends!</button>
             
                {userData?.friends ? (userData.friends.map((friend) => (
                    <div className='friend-div'>
                    <p>{friend.firstName} {friend.lastName}</p>
                    <button onClick={() => handleRemoveFriend(friend)}>Remove Friend</button>
                    </div>
                )) ) : (
                    <div>
                        <p>No friends found...</p>
                    </div>
                )}
              
            </div>
            <div>
                <h2>Friend Requests</h2>
                {userData.friendRequests ? ( userData.friendRequests.map((request) => (
                    <div>
                        <p>{request.firstName} {request.lastName}</p>
                        <button onClick={() => handleAddFriend(request)}>Accept Friend Request</button>
                        <button onClick={() => handleDecline(request)}>Decline Friend Request</button>
                    </div>

                ))  
                  
                ) : (
                    <div>
                    <p>No friend requests yet...</p>
                    </div>
                )}
            </div>


        </div>
        <div className='stats-container'>
        <h2>Your Stats</h2>

        </div>
        </div>


</div>
    )
}

export default Profile;