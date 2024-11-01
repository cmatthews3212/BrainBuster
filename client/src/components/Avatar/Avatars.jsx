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
        return avatarSeeds.map((seed, index) => ({
            id: index + 1,
            seed,
            src: createAvatar(adventurer, {
                seed,
                size: 120,
                randomizeIds: true,

            }).toDataUri()
        }))
    }, []);

       


    const handleAvatarSelect = (avatar)=> {
        setSelectedAvatar(avatar)

    };

    const clearSelection = () => {
        setSelectedAvatar(null);
    }
       
        
    console.log(avatarsArray[1])
      
       
   
  
    return (
        <div className='avatar-container'>
            {selectedAvatar ? (
                <AvatarDisplay name={selectedAvatar.seed} id={selectedAvatar.id} src={selectedAvatar.src} onClear={clearSelection} />
            ) : (
                avatarsArray.map((avatar) => (
                    <img name={avatar.seed} className='avatar'  key={avatar.id} src={avatar.src} alt={`Avatar ${avatar.id}`} onClick={() => handleAvatarSelect(avatar)}></img>
                ))
            )}
           
        </div>
    )

}

export default AvatarsList;