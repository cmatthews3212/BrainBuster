import Avatar from '../components/Avatar/Avatars';
import CustomizeAvatar from '../components/Avatar/CustomizeAvatar';
import { useNavigate } from 'react-router-dom';
// this should have the "friends", "settings", and "rankings" as components

const Profile = () => {
    const navigate = useNavigate();

    const renderAvatarsPage = () => {
        navigate('/avatars')
        
    }
    return (
        <div className="profile">
            <button onClick={renderAvatarsPage}>See Avatars</button>
            
        </div>
    )
}

export default Profile;