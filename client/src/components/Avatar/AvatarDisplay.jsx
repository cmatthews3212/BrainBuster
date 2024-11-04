import React from 'react';
import { useState } from 'react';
import CustomizeAvatar from './CustomizeAvatar';

const AvatarDisplay = ({ src, avatarId, name, onClear }) => {
    const [isCustomizing, setIsCustomizing] = useState(false);

    if (!src) return null;

    const handleSelectedAvatar = () => {
       setIsCustomizing(true);

    }

    if (isCustomizing) {
        return <CustomizeAvatar name={name} id={avatarId} src={src} onBack={onClear} />
    }
    return (
        <div className='avatar-display'>
            <h2>YOUR AVATAR</h2>
            <img name={name} id={avatarId} src={src} alt='Selected Avatar' />
            <div className='btns'>
            <button className='customizeBtn' onClick={handleSelectedAvatar}>Select this Avatar</button>
            <button className='customizeBtn' onClick={onClear}>Back to Avatars</button>

            </div>
        </div>
    );
};

export default AvatarDisplay;