import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_USERS } from "../../utils/queries";
import Profile from "../../pages/Profile";
import { useNavigate } from "react-router-dom";

const FriendProfile = ({ friend, onClear }) => {
    // const { loading, data } = useQuery(QUERY_USERS);

    // const friendsData = data?.users || {}
    console.log(friend)

    // for (const friend of friendsData) {
    //     if (friend._id === dataSet._id) {
    //         console.log(id)
    //     }
    // }

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
                <button>Send Friend Request to {friend.firstName}</button>
            </div>
        </div>
    )
}

export default FriendProfile;