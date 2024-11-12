import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { GET_ME, QUERY_USERS, QUERY_USER } from "../utils/queries"
import Auth from "../utils/auth";
import './FriendProfile.css';

const FriendProfile = () => {
    const { id } = useParams();
    console.log(id)
    
   
    const me = Auth.getProfile().data;
    const {loading, error, data} = useQuery(QUERY_USERS);



  


    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        console.error(error)
    }

 
        for (const user of data.users) {
            if (user._id === id) {
                return (
                    <div className="user-profile">
                        <div className="profile-card">
                            {user.avatar?.src ? (
                                <div className="profile-avatar">
                                    <img src={user.avatar.src} alt={`${user.firstName}'s avatar`} />
                                </div>
                            ) : (
                                <div className="default-avatar">
                                    {user.firstName.charAt(0)}
                                </div>
                            )}
                            <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
                            <div className="friend-status">You are friends!</div>
                                <h2>{user.firstName}'s Stats:</h2>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                width: '60%',
                                margin: '0 auto'
                            }}>
                                <div>
                                    <h3>Games Played</h3>
                                    <p style={{
                                        fontSize: '25px'
                                    }}>{user.stats.gamesPlayed}</p>
                                </div>
                                <div>
                                    <h3>Games Won</h3>
                                    <p style={{
                                        fontSize: '25px'
                                    }}>{user.stats.gamesWon}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }

    
    



 

    
}

export default FriendProfile;