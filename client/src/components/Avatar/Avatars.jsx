import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
// import { style } from '@dicebear/adventurer';
import { useMemo } from 'react';
import { create } from '@dicebear/adventurer';
import AvatarDisplay from './AvatarDisplay';
import { useNavigate } from 'react-router-dom';


const AvatarsList = ({ onSelect }) => {

    const navigate = useNavigate();
   
 
    const avatarsArray = useMemo(() => {
        const avatarSeeds = ["Chase", "Destiny", "Kingston", "Jessica", "Jack"];
        return avatarSeeds.map(seed => createAvatar(adventurer, {
            seed,
            size: 120,
            randomizeIds: true,
        }).toDataUri());
    }, []);

       


    const handleAvatarSelect = (src) => {
        navigate(`avatar/${src}`)

    }
       
        
      
       
   
  
    return (
        <div className='avatar-container'>
           {avatarsArray.map((src, index) => (
            <img className='avatar' id={index + 1} key={index} src={src} alt={`Avatar ${index + 1}`} onClick={() => handleAvatarSelect(src)}></img>
        ))}
        </div>
    )

}

export default AvatarsList;