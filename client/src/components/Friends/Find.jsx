import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_USERS } from "../../utils/queries";
import Profile from "../../pages/Profile";
import FriendSelect from "./Friend";
import { useNavigate } from "react-router-dom";

const FindFriends = () => {
    const [selectedFriend, setSelectedFriend] = useState('')
    const navigate = useNavigate();
    const { loading, data } = useQuery(QUERY_USERS);

    const friendsData = data?.users || {}
    console.log(friendsData)

    const handleFriendSelect = async (friend) => {
        setSelectedFriend(friend)
        if (selectedFriend == friend) {
            navigate('/friend')
        }
    
    }

    const clearSelection = () => {
        setSelectedFriend(null)

    }

    console.log(selectedFriend)
    if (loading) {
        return <p>Loading Users...</p>
    }

    if (selectedFriend) {
        return <FriendSelect friend={selectedFriend} onClear={clearSelection} />
    }

    return (
        <div className="find-friends-container">
            <h2>FIND FRIENDS</h2>
            <div>
            <ul>
            {friendsData ? (
              
                    friendsData.map((friend) => (
                        <div>
                            <li onClick={() => handleFriendSelect(friend)} key={friend._id}>{friend.firstName} {friend.lastName}</li>
                            
                        </div>
                 
                        
                    ))
              
            ) : (
                <p>No Users Found...</p>
            )}
            </ul>
            </div>
            
        </div>

        
    )


}

export default FindFriends;