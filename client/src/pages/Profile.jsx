import './Profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import FriendsList from '../components/Profile/FriendsList';
import FriendRequests from '../components/Profile/FriendRequests';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import socket from '../socket'
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
            update: (cache) => {
                // Remove friend from the current user's friends list
                cache.modify({
                    id: cache.identify(userData),
                    fields: {
                        friends(existingFriendsRefs = [], { readField }) {
                            return existingFriendsRefs.filter(
                                (friendRef) => readField('_id', friendRef) !== friend._id
                            );
                        }
                    }
                });

                // Remove current user from the friend's friends list
                cache.modify({
                    id: cache.identify(friend),
                    fields: {
                        friends(existingFriendsRefs = [], { readField }) {
                            return existingFriendsRefs.filter(
                                (userRef) => readField('_id', userRef) !== userData._id
                            );
                        }
                    }
                });
            }
        });
            
        
        console.log('friend removed')
        console.log(data)
    } catch (err) {
        console.error(err)
    }

    // window.location.reload();
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
                // Remove the declined friend request from the current user's friendRequests list
                cache.modify({
                    id: cache.identify(userData),
                    fields: {
                        friendRequests(existingRequestsRefs = [], { readField }) {
                            return existingRequestsRefs.filter(
                                (requestRef) => readField('_id', requestRef) !== request._id
                            );
                        }
                    }
                });
            }
        });
        console.log('friend request declined')
        console.log(data)
    } catch (err) {
        console.error(err)
    }

    // window.location.reload();
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
                if (!addFriend) return;

                // Add only the requested friend to the current user's friends list
                cache.modify({
                    id: cache.identify(userData),
                    fields: {
                        friends(existingFriendsRefs = []) {
                            const newFriendRef = cache.writeFragment({
                                data: addFriend.friend, // Only the friend data
                                fragment: gql`
                                    fragment NewFriend on User {
                                        _id
                                        firstName
                                        lastName
                                    }
                                `
                            });

                            // Prevent self-addition: only add if friend ID is different from user ID
                            return addFriend.friend._id !== userData._id && 
                                !existingFriendsRefs.some(ref => ref.__ref === newFriendRef.__ref)
                                ? [...existingFriendsRefs, newFriendRef]
                                : existingFriendsRefs;
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
    
    // window.location.reload();
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

const [gameId, setGameId] = useState(null);
const [inviterId, setInviterId] = useState(null);

useEffect(() => {
  // Handle receiving the game invitation
  const handleGameInvitation = ({ gameId, inviterId }) => {
    setGameId(gameId);
    setInviterId(inviterId);
    // You could show a modal here to ask if the user wants to join the game
    const shouldJoin = window.confirm(`You have been invited to join Game ${gameId} by player ${inviterId}. Do you want to join?`);
    if (shouldJoin) {
      socket.emit('acceptGameInvitation', { gameId });
    } else {
      socket.emit('declineGameInvitation', { gameId });
    }
  };

  // Listen for the game invitation
  socket.on('gameInvitation', handleGameInvitation);

  // Cleanup on component unmount
  return () => {
    socket.off('gameInvitation', handleGameInvitation);
  };
}, []);




if (loading) return <p>Loading Profile...</p>;
if (error) console.log(error);

return (
    <div className="profile">
        <ProfileHeader userData={userData} />
        
        <div className='profile-info'>
            <div className='friends-container'>
                <FriendsList 
                    userData={userData}
                    handleRemoveFriend={handleRemoveFriend}
                    navigate={navigate}
                />
                <FriendRequests 
                    userData={userData}
                    handleAddFriend={handleAddFriend}
                    handleDecline={handleDecline}
                />
            </div>
            
            <div className='stats-container'>
                <h2>Your Stats</h2>
                <div>
                    <h3>Games Played:</h3>
                    <p className=''
                </div>
            </div>
        </div>
    </div>
);
}

export default Profile;