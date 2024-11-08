import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_USERS } from "../../utils/queries";
import Profile from "../../pages/Profile";
import { useNavigate } from "react-router-dom";
import { ADD_FRIEND } from "../../utils/mutations";
import { SEND_FRIEND_REQUEST } from "../../utils/mutations";
import Auth from "../../utils/auth";

const FriendProfile = ({ friend, onClear }) => {
    
    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST)
    const handleAddFriend = async () => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const { data } = await sendFriendRequest({
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
                <button onClick={handleAddFriend}>Send Friend Request to {friend.firstName}</button>
            </div>
        </div>
    )
}

export default FriendProfile;