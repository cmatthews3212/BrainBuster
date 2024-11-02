import AvatarsList from './Avatars'
import { useEffect, useState, useMemo } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { useParams } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';




const CustomizeAvatar = ({ src, name, onBack }) => {
    const hairSeeds = ["long01", "long02", "long03", "long04", "long05","long06","long07","long08", "long09" , "long10" , "long11" , "long12" , "long13","long14","long15","long16","long17","long18","long19","long20","long21","long22","long23","long24","long25","long26","short01","short02","short03","short04","short05","short06","short07","short08","short09","short10","short11","short12","short13","short14","short15","short16" , "short17" , "short18" , "short19"]
    const hairColorSeeds = ["0e0e0e","3eac2c","6a4e35","85c2c6","796a45","562306","592454","ab2a18","ac6511","afafaf","b9a05f","cb6820","dba3be","e5d7a3"]
    const mouthSeeds = ["variant01","variant02", "variant03","variant04","variant05","variant06","variant07","variant08","variant09","variant10","variant11","variant12","variant13","variant14","variant15","variant16","variant17","variant18","variant19","variant20","variant21","variant22","variant23","variant24","variant25","variant26","variant27","variant28","variant29","variant30"]
    const eyesSeeds = ["variant01","variant02","variant03","variant04","variant05","variant06","variant07","variant08","variant09","variant10" ,"variant11" , "variant12" , "variant13" , "variant14" , "variant15" , "variant16" , "variant17" , "variant18", "variant19" , "variant20" , "variant21"  , "variant22" , "variant23" , "variant24" , "variant25" , "variant26"]
    const eyebrowSeeds = ["variant01","variant02","variant03","variant04", "variant05","variant06","variant07","variant08","variant09","variant10","variant11", "variant12", "variant13" , "variant14" , "variant15"]
    const earringsSeeds = ["variant01","variant02","variant03","variant04","variant05","variant06"]
    const featuresSeeds = ["birthmark","blush","freckles","mustache"]
    const glassesSeeds = ["variant01","variant02","variant03","variant04","variant05"]
    if (!src) return null;

    const [avatarSrc, setAvatarSrc] = useState("");
    const [options, setOptions] = useState({
        seed: name,
        hairProbability: 0,
        glassesProbability: 0,
        mouth: ["variant01"],
        eyes: ["variant01"],
        eyebrows: ["variant12"]
        
    });


        const hairArray = useMemo(() => {
     
            const seeds = hairSeeds.map((hair) => ({
               src: createAvatar(adventurer, {
                    seed: options.seed,
                    size: 120,
                    hairProbability: 100,
                    hairColor: hairColorSeeds[0],
                    glassesProbability: 0,
                    mouth: ["variant01"],
                    eyes: ["variant01"],
                    eyebrows: ["variant12"],
                    hair: [hair]

                }).toDataUri()
            }))
            return seeds
        }, []);

        

        const renderHairSelect = () => {
            for (const hair of hairArray) {

            }
        }
    

    

    useEffect(() => {

        const avatar = createAvatar(adventurer, {
            seed: options.seed,
            size: 120,
            hair: options.hair,
            mouth: options.mouth,
            eyes: options.eyes,
            eyebrows: options.eyebrows,
            glassesProbability: options.glassesProbability
            

        });

       setAvatarSrc(avatar.toDataUri())
    }, [options]);

    const handleOptionsChange = (key, value) => {
        setOptions((prevOptions) => ({...prevOptions, [key]: value }));
    }

    
   


    return (
        <div className='customize-container'>
           <h2>Customize my Avatar!</h2>
           <div>
            <img key={src} name={name} src={src}></img>
            <div className='customizations'>
                <h2>Hair Style</h2>
            {hairArray.map((hair) => (
                    <img name={hair.seed} className='avatar' src={hair.src}></img>
                ))}
                
            </div>

           </div>
           <button onClick={onBack}>Change Avatar</button>
        </div>
    )


}

export default CustomizeAvatar;