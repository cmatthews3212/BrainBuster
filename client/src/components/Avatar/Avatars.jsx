import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
// import { style } from '@dicebear/adventurer';
import { useMemo, useState } from 'react';
import { create } from '@dicebear/adventurer';
import AvatarDisplay from './AvatarDisplay';



const AvatarsList = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);

   
 
    const avatarsArray = useMemo(() => {
        const avatarSeeds = ["Chase", "Destiny", "Kingston", "Jessica", "Jack"];
        return avatarSeeds.map(seed => createAvatar(adventurer, {
            seed,
            size: 120,
            randomizeIds: true,
        }).toDataUri());
    }, []);

       


    const handleAvatarSelect = (src) => {
        setSelectedAvatar(src)

    };

    const clearSelection = () => {
        setSelectedAvatar(null);
    }
       
        
      
       
   
  
    return (
        <div className='avatar-container'>
            {selectedAvatar ? (
                <AvatarDisplay src={selectedAvatar} onClear={clearSelection} />
            ) : (
                avatarsArray.map((src, index) => (
                    <img className='avatar' id={index + 1} key={index} src={src} alt={`Avatar ${index + 1}`} onClick={() => handleAvatarSelect(src)}></img>
                ))
            )}
           
        </div>
    )

}

export default AvatarsList;