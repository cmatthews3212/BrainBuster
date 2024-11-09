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
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
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
            variables: {
                userId: Auth.getProfile().data._id, 
                friendId: friend._id
            },
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
        });
        console.log('friend request declined')
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}


console.log(userData)
console.log(Auth.getProfile().data)

const handleAddFriend = async (request) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
        return false;
    }

    try {
       
        console.log("userId", Auth.getProfile().data._id, 'friendId', request._id)
        const { data } = await addFriend({
            variables: { 
                userId: Auth.getProfile().data._id, 
                friendId: request._id 
            },
            update: (cache, { data: { addFriend } }) => {
                // Add friend to the cache for the current user
                cache.modify({
                  fields: {
                    me(existingUserData = {}) {
                      const newFriend = addFriend.friend; // friend object from the response
                      return {
                        ...existingUserData,
                        friends: [...existingUserData.friends, newFriend]
                      };
                    }
                  }
                });
        
                // Add current user to the friend's cache
                cache.modify({
                  id: cache.identify(addFriend.friend),
                  fields: {
                    friends(existingFriends = []) {
                      return [...existingFriends, addFriend.user]; // current user added to friend's list
                    }
                  }
                });
              }
                
           
        });

        if (data.addFriend.success) {
            console.log("friends added successfully", data.addFriend)
        }
        console.log('friend added')
        console.log(data)
    } catch (err) {
        console.error(err)
    }

    handleDecline(request);
}



console.log(selectedFriend)


const handleFriendSelect = async (friend) => {
    setSelectedFriend(friend)
   
    if (selectedFriend == friend) {
       return
    }

}

const clearSelection = () => {
    setSelectedFriend(null)

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
                    <p>{friend.firstName} {friend.lastName} {friend._id}</p>
                    <button onClick={() => handleRemoveFriend(friend)}>Remove Friend</button>
                    <Link to={`/profile/${friend._id}`}>View Friend</Link>
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