import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
// import { style } from '@dicebear/adventurer';
import { useMemo, useState } from 'react';
import { create } from '@dicebear/adventurer';
import AvatarDisplay from './AvatarDisplay';
import CustomizeAvatar from './CustomizeAvatar';
// "Jack", "Wyatt", "Nolan", "Christopher", "Katherine", "Vivian", "Jessica", "Ryan", "Brooklynn", "Liliana", "Avery", "Maria", "Kimberly", "Christian", "Caleb", "Luis", "Brian", "Amaya", "Mason", "Jameson", "Alexander", "Sawyer", "Easton", "Andrea", "Christian", "Jocelyn", "Mason", "Caleb", "Ryan", "Liliana", "Valentina", "Sophia"



const AvatarsList = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const avatarSeeds = ["Chase", "Destiny", "Kingston", "Avery",];
  
   
 
    const avatarsArray = useMemo(() => {
     
        return avatarSeeds.map((seed, index) => ({
            id: index + 1,
            seed,
            src: createAvatar(adventurer, {
                seed,
                size: 120,
                hairProbability: 0,
                glassesProbability: 0,
                mouth: [],
                eyes: [],
                eyebrows: []
            

                
            

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
                <CustomizeAvatar name={selectedAvatar.seed} id={selectedAvatar.id} src={selectedAvatar.src} onClear={clearSelection} />
            ) : (
            
                avatarsArray.map((avatar) => (
                    <img name={avatar.seed} className='avatar'  key={avatar.id} src={avatar.src} alt={`Avatar ${avatar.id}`} onClick={() => handleAvatarSelect(avatar)}></img>
                ))
               
            )}
           
        </div>
    )

}

export default AvatarsList;