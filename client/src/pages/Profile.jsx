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

        

        const avatarSrc = data?.me || {}

      



    return (
   
        <div className="profile">
            <img src={avatarSrc.avatar.src}></img>
            <button onClick={renderAvatarsPage}>See Avatars</button>
            
        </div>
    )
}

export default Profile;