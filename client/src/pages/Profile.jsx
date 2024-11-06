import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { UPDATE_AVATAR } from '../utils/mutations';
// this should have the "friends", "settings", and "rankings" as components

const Profile = () => {
   
    const navigate = useNavigate();

    const renderAvatarsPage = () => {
        navigate('/avatars')
        
    }

  
        const { loading, data } = useQuery(GET_ME);

        
    

        const userData = data?.me || {}
        console.log(userData)

        
        
      
        
        
        // if (userData.avatar.src) {
            //     return  ( 
                //         <div>
                //             <img src={userData.avatar.src}></img>
        //             <button className="change-avatar-btn" onClick={renderAvatarsPage}>Change Avatar</button>

        //         </div>
        // )
        // } else {
            //     return (
                //         <div>
                //             <button className="change-avatar-btn" onClick={renderAvatarsPage}>Create Avatar</button>
                //         </div>
                //     )
                // }
                
                
                if (loading) {
                    return <p>Loading Profile...</p>
                }
                
                
                
                return (
                    
                    <div className="profile">
            <div className='profile-head'>
                <h2>Hello, {userData.firstName || "User"}</h2>
                <div>

                 {userData.avatar?.src ? (

                 <>
                <img src={userData.avatar.src}></img>
                <button className="change-avatar-btn" onClick={renderAvatarsPage}>Change Avatar</button>
                </>
                 ) : (
                    <button className='change-avatar-btn' onClick={renderAvatarsPage}>Create Avatar</button>
                 )}

                </div>

            </div>
            <div className='profile-info'>

            <div className='friends-container'>
                <h2>Your Friends</h2>
                

            </div>
            <div className='stats-container'>
                <h2>Your Stats</h2>

            </div>
            </div>

            
        </div>
    )
}

export default Profile;