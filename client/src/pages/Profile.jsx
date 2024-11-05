import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
// this should have the "friends", "settings", and "rankings" as components

const Profile = () => {
    const navigate = useNavigate();

    const renderAvatarsPage = () => {
        navigate('/avatars')
        
    }

  
        const { loading, error, data } = useQuery(QUERY_USER, {
            variables: { avatar }
        });

        const avatarSrc = data.user.avatar.src;



    return (
   
        <div className="profile">
            <button onClick={renderAvatarsPage}>See Avatars</button>
            
        </div>
    )
}

export default Profile;