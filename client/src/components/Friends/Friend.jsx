import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_USERS } from "../../utils/queries";
import Profile from "../../pages/Profile";
import { useNavigate } from "react-router-dom";
import { ADD_FRIEND } from "../../utils/mutations";
import { SEND_FRIEND_REQUEST } from "../../utils/mutations";
import { GET_ME } from "../../utils/queries";
import Auth from "../../utils/auth";

const FriendProfile = ({ friend, onClear, gameId }) => {
    

    const { loading, error, data } = useQuery(GET_ME)
    console.log(data)
    const myData = data?.me || {}
    
    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST)
    const handleAddFriend = async () => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            console.log('FRIEND ID', friend.firstName, friend.lastName, friend._id, 'USER ID', Auth.getProfile().data.firstName, Auth.getProfile().data.lastName, Auth.getProfile().data._id)
            const { data } = await sendFriendRequest({
                // variables: {
                //     userId: Auth.getProfile().data._id, // The person sending the request
                //     friendId: friend._id, // The person receiving the request
                //     firstName: Auth.getProfile().data.firstName, // The requester's first name
                //     lastName: Auth.getProfile().data.lastName, // The requester's last name
                //     email: Auth.getProfile().data.email,
                // }
                variables: {
                    userId: Auth.getProfile().data._id,
                    friendId: friend._id, // friend._id should be an ObjectId
                }

            });
         
            console.log('friend request sent')
            console.log(data)
        } catch (err) {
            console.error(err)
            
        }
    }

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    if (error) {
    console.error(error)
    }

    
    return (
        <div>
            <div>
            <h2>{friend.firstName} {friend.lastName}</h2>
            <button onClick={onClear}>Go back to find friends</button>
            </div>
            <div>
                <h3>{friend.firstName}'s Stats:</h3>
            </div>
            <div>
                <h3>{friend.firstName}'s </h3>
            </div>
            <div>
                {data.me.friends ? (
                   data.me.friends.map((meFriend) => (
                    meFriend._id === friend._id ? <button>Invite {friend.firstName} to a Game!</button> : <button onClick={handleAddFriend}>Send Friend Request to {friend.firstName}</button>
                   ))
                ) : (
                    <>
                    <div>You have no friends</div>
                    </>
                )}
                
            </div>
        </div>
    )
}

export default FriendProfile;