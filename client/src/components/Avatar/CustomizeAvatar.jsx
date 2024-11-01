import AvatarsList from './Avatars'
import { useEffect, useState } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { useParams } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';




const CustomizeAvatar = ({ src, id, name, onBack }) => {
    if (!src) return null;

    const [avatarSrc, setAvatarSrc] = useState("");
    const [options, setOptions] = useState({
        seed: name,
        glasses: [],
        glassesProbability: 100
  

    });

    // const renderGlassesClick = (glasses) => {
    //     const avatar = createAvatar(adventurer, {
    //         seed: name,
    //         glasses: glasses
    //     });
        
    //     return avatar.toDataUri()
    // }

    useEffect(() => {

        const avatar = createAvatar(adventurer, {
            seed: options.seed,
            glasses: [options.glasses],
            glassesProbability: 100,
            size: 120,
       
          
            

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
            <img key={avatarSrc} name={name} src={avatarSrc}></img>
            <div className='customizations'>
                <label>Acessories
                    <select value={options.glasses}
                    onChange={(e) => handleOptionsChange(glasses, e.target.value)}>
                        <option value="variant01">Round Glasses</option>
                        <option value="variant02">Sunglasses</option>
                        <option value="variant03">None</option>
                    </select>
                </label>

                
            </div>

           </div>
           <button onClick={onBack}>Change Avatar</button>
        </div>
    )


}

export default CustomizeAvatar;