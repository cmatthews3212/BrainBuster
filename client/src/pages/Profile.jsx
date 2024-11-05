import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
// this should have the "friends", "settings", and "rankings" as components

const Profile = () => {
    const navigate = useNavigate();

    const renderAvatarsPage = () => {
        navigate('/avatars')
        
    }

  
        const { loading, data } = useQuery(GET_ME);

        
    

        const userData = data?.me || {}

      



    return (
   
        <div className="profile">
            <div className='profile-head'>
                <h2>Hello, {userData.firstName}</h2>
                <div>
                <img src={userData.avatar.src}></img>
                <button className="change-avatar-btn" onClick={renderAvatarsPage}>Change Avatar</button>

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