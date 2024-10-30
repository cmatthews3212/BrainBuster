import AvatarsList from './Avatars'
import { useState } from 'react';
import AvatarDisplay from './AvatarDisplay';


const CustomizeAvatar = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null)

    const handleAvatarSelect = (avatarSrc) => {
        setSelectedAvatar(avatarSrc)
    }



    return (
        <div className='customize-container'>
            {
                !selectedAvatar ? (
                    <AvatarsList onSelect={handleAvatarSelect}/>
                ) : (
                    <AvatarDisplay avatarSrc={selectedAvatar} onBack={() => setSelectedAvatar(null)} />
                )
            }
        </div>
    )


}

export default CustomizeAvatar;