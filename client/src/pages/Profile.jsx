import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
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

                // Update the current user's friends list
                cache.modify({
                    id: cache.identify(userData),
                    fields: {
                        friends(existingFriendsRefs = []) {
                            const newFriendRef = cache.writeFragment({
                                data: addFriend.friend, // Friend data returned from the mutation
                                fragment: gql`
                                    fragment NewFriend on User {
                                        _id
                                        firstName
                                        lastName
                                    }
                                `
                            });
                            return [...existingFriendsRefs, newFriendRef];
                        }
                    }
                });

                // Update the added friend's friends list to include the current user
                cache.modify({
                    id: cache.identify(addFriend.friend),
                    fields: {
                        friends(existingFriendsRefs = []) {
                            const currentUserRef = cache.writeFragment({
                                data: addFriend.user,
                                fragment: gql`
                                    fragment CurrentUser on User {
                                        _id
                                        firstName
                                        lastName
                                    }
                                `
                            });
                            return [...existingFriendsRefs, currentUserRef];
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




if (loading) {
    return <p>Loading Profile...</p>
}

if (error) {
    console.log(error)
}
                
return (
    
            <div className="profile"
            style={{
                marginTop: '100px'
            }}>

        <div className='profile-head'
        style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
        }}>
        <h2>Hello, {userData.firstName || "User"}</h2>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>

            {userData.avatar?.src ? (

            <>
        <img src={userData.avatar.src}
        style={{
            width: '150px'
        }}></img>
        <button className="change-avatar-btn" onClick={renderAvatarsPage}
        style={{
            backgroundColor: 'rgb(255, 64, 129)',
            color: 'rgb(255, 255, 255)',
            border: 'none',
            borderRadius: '10px',
            width: '150px',
            height: '50px',
            fontSize: '15px'
        }}>Change Avatar</button>
        </>
            ) : (
            <button className='change-avatar-btn' onClick={renderAvatarsPage}>Create Avatar</button>
            )}

        </div>

        </div>
        <div className='profile-info'>
        <div>
          
        </div>

        <div className='friends-container'
        style={{
            backgroundColor: 'white',
            width: '90%',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            margin: '0 auto',
            marginTop: '20px',
            padding: '20px'
        }}>

            <div>

                <h2>Your Friends</h2>
                <button onClick={() => navigate('/find')}style={{
                        backgroundColor: 'rgb(255, 64, 129)',
                        color: 'rgb(255, 255, 255)',
                        border: 'none',
                        borderRadius: '7px',
                        width: '150px',
                        padding: '10px',
                        // height: '20px',
                        textDecoration: 'none',
                        fontSize: '15px',
                        margin: '10px'
                    }}>Find Friends!</button>
             <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                
                
            }}>
                {userData?.friends ? (userData.friends.map((friend) => (
                    <div className='friend-div' style={{
                        border: '3px solid white',
                        margin: '10px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    }}>
                    <h3>{friend.firstName} {friend.lastName}</h3>
                    <hr></hr>
                    <div className='friendBtns' style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                    <Link className='viewFriend' to={`/profile/${friend._id}`}
                    style={{
                        backgroundColor: 'rgb(255, 64, 129)',
                        color: 'rgb(255, 255, 255)',
                        border: 'none',
                        borderRadius: '7px',
                        width: '80px',
                        padding: '10px',
                        // height: '20px',
                        textDecoration: 'none',
                        fontSize: '15px',
                        margin: '10px'
                    }}>View Friend</Link>
                    <button  className="removeFriend" onClick={() => handleRemoveFriend(friend)}
                        style={{
                            backgroundColor: 'red',
                            color: 'rgb(255, 255, 255)',
                            border: 'none',
                            borderRadius: '7px',
                            width: '100px',
                            height: '30px',
                            fontSize: '12px',
                            margin: '10px'
                        }}>Remove Friend</button>
                        </div>
                   
                    </div>
                )) ) : (
                    <div>
                        <p>No friends found...</p>
                    </div>
                )}
                </div>
              
            </div>
                  
            <div>
                <h2>Friend Requests</h2>
                {userData.friendRequests ? ( userData.friendRequests.map((request) => (
    
                    <div>
                        <h3>{request.firstName} {request.lastName}</h3>
                        <hr></hr>
                        <button onClick={() => handleAddFriend(request)} style={{
                            backgroundColor: 'rgb(255, 64, 129)',
                            color: 'rgb(255, 255, 255)',
                            border: 'none',
                            borderRadius: '7px',
                            width: '150px',
                            height: '30px',
                            fontSize: '12px',
                            margin: '10px'
                        }}>Accept Friend Request</button>
                        <button onClick={() => handleDecline(request)} style={{
                            backgroundColor: 'red',
                            color: 'rgb(255, 255, 255)',
                            border: 'none',
                            borderRadius: '7px',
                            width: '150px',
                            height: '30px',
                            fontSize: '12px',
                            margin: '10px'
                        }}>Decline Friend Request</button>
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