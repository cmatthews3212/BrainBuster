import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_USERS } from "../../utils/queries";
import Profile from "../../pages/Profile";
import FriendSelect from "./Friend";
import { useNavigate } from "react-router-dom";
import Auth from '../../utils/auth'
import './Find.css';

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
            <div className="friends-list-container">
                <ul>
                    {friendsData ? (
                        friendsData.map((friend) => (
                            friend._id !== Auth.getProfile().data._id ? (
                          <li 
                                key={friend._id}
                                className="friend-item"
                                onClick={() => handleFriendSelect(friend)}
                            >
                                <div className="friend-info">
                                    <div className="friend-avatar">
                                        {friend.avatar?.src ? (
                                            <img src={friend.avatar.src} alt={`${friend.firstName}'s avatar`} />
                                        ) : (
                                            friend.firstName.charAt(0)
                                        )}
                                    </div>
                                    <span>{friend.firstName} {friend.lastName}</span>
                                </div>
                            </li>
                            ) : (<></>)
                        ))
                    ) : (
                        <p className="no-users">No Users Found...</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default FindFriends;