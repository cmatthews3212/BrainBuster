import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { GET_ME, QUERY_USERS, QUERY_USER } from "../utils/queries"
import Auth from "../utils/auth";

const FriendSelect = ({ friend, onClear, gameId }) => {
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
                    <div className="user-profile" style={{
                        marginTop: '100px'
                    }}>
                        <img src={user.avatar.src}></img>
                        <h2>{user.firstName} {user.lastName}</h2>
                        <h3>You are friends!</h3>
                        
                    </div>
                )
            }
        }

    
    



 

    
}

export default FriendSelect;