import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { UPDATE_AVATAR } from '../utils/mutations';
import { QUERY_USERS } from '../utils/queries';
import { REMOVE_FRIEND } from '../utils/mutations';
import { DECLINE_FRIEND_REQUEST } from '../utils/mutations';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth'
import FriendProfile from '../components/Friends/Friend';
// this should have the "friends", "settings", and "rankings" as components

const Profile = () => {
    const [selectedFriend, setSelectedFriend] = useState('')

    const navigate = useNavigate();
    
    const renderAvatarsPage = () => {
    navigate('/avatars')
}

   
const { loading, error, data } = useQuery(GET_ME);




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
            
            },
            update: (cache) => {
                cache.modify({
                    fields: {
                        friendRequests(existingRequests = []) {
                            return existingRequests.filter((req) => req._id !== request._id)
                        },
                    },
                });
            }
        });
        console.log('friend request declined')
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}


console.log(userData)
console.log(Auth.getProfile().data)

const handleAddFriend = async (friend) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
        return false;
    }

    try {
        console.log('FRIEND ID', friend.firstName, friend.lastName, friend._id, 'USER ID', Auth.getProfile().data.firstName, Auth.getProfile().data.lastName, Auth.getProfile().data._id)
        const { data } = await addFriend({
            variables: {
                userId: Auth.getProfile().data._id,
                friendId: friend._id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                email: friend.email

            }
        });
        console.log('friend added')
        console.log(data)
    } catch (err) {
        console.error(err)
    }

    handleDecline(friend);
}


const handleFriendSelect = async (friend) => {
    setSelectedFriend(friend)
    if (selectedFriend == friend) {
        navigate('/friend')
    }

}

const clearSelection = () => {
    setSelectedFriend(null)

}


if (selectedFriend) {
    return <FriendProfile gameId={"gameId"} friend={selectedFriend} onClear={clearSelection} />
}


if (loading) {
    return <p>Loading Profile...</p>
}

if (error) {
    console.log(error)
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
                    <button onClick={() => handleFriendSelect(friend)}>View Friend</button>
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
                        <p>{request.firstName} {request.lastName} {request._id}</p>
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