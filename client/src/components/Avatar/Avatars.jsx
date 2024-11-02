import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
// import { style } from '@dicebear/adventurer';
import { useMemo, useState } from 'react';
import { create } from '@dicebear/adventurer';
import AvatarDisplay from './AvatarDisplay';



const AvatarsList = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const avatarSeeds = ["Chase", "Destiny", "Kingston", "Jessica", "Jack", "Wyatt", "Nolan", "Christopher", "Katherine", "Vivian", "Jessica", "Ryan", "Brooklynn", "Liliana", "Avery", "Maria", "Kimberly", "Christian", "Caleb", "Luis", "Brian", "Amaya", "Mason", "Jameson", "Alexander", "Sawyer", "Easton", "Andrea", "Christian", "Jocelyn", "Mason", "Caleb", "Ryan", "Liliana", "Valentina", "Sophia"];
    const hairSeeds = ["long01", "long02", "long03", "long04", "long05","long06","long07","long08", "long09" , "long10" , "long11" , "long12" , "long13","long14","long15","long16","long17","long18","long19","long20","long21","long22","long23","long24","long25","long26","short01","short02","short03","short04","short05","short06","short07","short08","short09","short10","short11","short12","short13","short14","short15","short16" , "short17" , "short18" , "short19"]
    const mouthSeeds = ["variant01"
        ,
        "variant02"
        ,
        "variant03"
        ,
        "variant04"
        ,
        "variant05"
        ,
        "variant06"
        ,
        "variant07"
        ,
        "variant08"
        ,
        "variant09"
        ,
        "variant10"
        ,
        "variant11"
        ,
        "variant12"
        ,
        "variant13"
        ,
        "variant14"
        ,
        "variant15"
        ,
        "variant16"
        ,
        "variant17"
        ,
        "variant18"
        ,
        "variant19"
        ,
        "variant20"
        ,
        "variant21"
        ,
        "variant22"
        ,
        "variant23"
        ,
        "variant24"
        ,
        "variant25"
        ,
        "variant26"
        ,
        "variant27"
        ,
        "variant28"
        ,
        "variant29"
        ,
        "variant30"]
   
 
    const avatarsArray = useMemo(() => {
     
        return avatarSeeds.map((seed, index) => ({
            id: index + 1,
            seed,
            src: createAvatar(adventurer, {
                seed,
                size: 120,
                hairProbability: 0,
                glassesProbability: 0,
                mouth: ["variant01"]

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