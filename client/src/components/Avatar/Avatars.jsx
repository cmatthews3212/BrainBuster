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
                hairProbability: 100,
                glassesProbability: 0,
                mouth: ["variant02"],
                eyes: ["variant02"],
                eyebrows: ["variant09"],
                hair: ["long01"],
                hairColor: ["black"]

            

                
            

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
        <div className='avatar-container'
        style={{ 
            backgroundColor: 'white',
            flex: 1,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gridTemplateColumns: '250px 1fr',
            borderRadius: '10px',
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 10px",
            width: '75%',
            gap: '2rem',
            margin: '0 auto',
            marginTop: '64px'}}>

            <h2>Create your Avatar!</h2>
            <div>
            {selectedAvatar ? (
                <CustomizeAvatar name={selectedAvatar.seed} id={selectedAvatar.id} src={selectedAvatar.src} onClear={clearSelection} />
            ) : (
              
               
                avatarsArray.map((avatar) => (
                    <img  name={avatar.seed} className='avatar base'  key={avatar.id} src={avatar.src} alt={`Avatar ${avatar.id}`} onClick={() => handleAvatarSelect(avatar)}
                    style={{
                        width: '100px',
                        height: '100px',
              
                    }}
                    
                    ></img>
                ))

            
               
            )}
            </div>
           
        </div>
    )

}

export default AvatarsList;