import React from 'react';
import { useState } from 'react';
import CustomizeAvatar from './CustomizeAvatar';

const AvatarDisplay = ({ src, avatarId, onClear }) => {
    const [isCustomizing, setIsCustomizing] = useState(false);

    if (!src) return null;

    const handleSelectedAvatar = () => {
       setIsCustomizing(true);

    }

    if (isCustomizing) {
        return <CustomizeAvatar id={avatarId} src={src} onBack={onClear} />
    }
    return (
        <div className='avatar-display'>
            <h2>Your Avatar!</h2>
            <img id={avatarId} src={src} alt='Selected Avatar' />
            <div>
            <button onClick={handleSelectedAvatar}>Select this Avatar</button>
            <button onClick={onClear}>Back to Avatars</button>

            </div>
        </div>
    );
};

export default AvatarDisplay;