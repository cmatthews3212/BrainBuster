import React from 'react';
import { useParams  } from 'react-router-dom';

const AvatarDisplay = ({ src, onClear }) => {
    if (!src) return null;
    return (
        <div className='avatar-display'>
            <h2>Your Avatar!</h2>
            <img src={src} alt='Selected Avatar' />
            <button onClick={onClear}>Back to Avatars</button>
        </div>
    );
};

export default AvatarDisplay;