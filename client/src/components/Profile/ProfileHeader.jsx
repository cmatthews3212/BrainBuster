import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ userData }) => {
    const navigate = useNavigate();
    
    const renderAvatarsPage = () => {
        navigate('/avatars');
    }

    return (
        <div className='profile-head'>
            <h2>Hello, {userData.firstName || "User"}</h2>
            <div className='avatar-container'>
                {userData.avatar?.src ? (
                    <>
                        <img src={userData.avatar.src} alt="User avatar" />
                        <button className="change-avatar-btn" onClick={renderAvatarsPage}>
                            Change Avatar
                        </button>
                    </>
                ) : (
                    <button className='change-avatar-btn' onClick={renderAvatarsPage}>
                        Create Avatar
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProfileHeader; 