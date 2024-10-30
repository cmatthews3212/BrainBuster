import React from 'react';
import { useParams  } from 'react-router-dom';

const AvatarDisplay = () => {
    const { src } = useParams();
    return (
        <div className='avatar-display'>
            <img src={src} alt='Selected Avatar' />
        </div>
    );
};

export default AvatarDisplay;