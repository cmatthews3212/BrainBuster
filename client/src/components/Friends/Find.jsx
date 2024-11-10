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
        <div className="find-friends-container" style={{
            marginTop: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <h2>FIND FRIENDS</h2>
            <div>
            <ul style={{
                listStyle: 'none',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}>
            {friendsData ? (
              
                    friendsData.map((friend) => (
                        <div>
                            <li onClick={() => handleFriendSelect(friend)} key={friend._id}
                                style={{
                                    fontSize: '30px',
                                    margin: '20px',
                                    backgroundColor: 'rgb(255, 64, 129)',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                }} className="findFriendBtn">{friend.firstName} {friend.lastName}</li>
                            
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