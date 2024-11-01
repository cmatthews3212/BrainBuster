import AvatarsList from './Avatars'
import { useEffect, useState } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { useParams } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';




const CustomizeAvatar = ({ src, id, name, onBack }) => {
    if (!src) return null;

    const [avatarSrc, setAvatarSrc] = useState('');
    const [options, setOptions] = useState({
        seed: `avatar-${id}`,
        accessories: 'roundGlasses',
        hair: 'shortFlat',
        clothingColor: '#FFD700',
        backgroundColor: '#FFFFFF',

    });

    useEffect(() => {
        const avatar = createAvatar(adventurer, {
            seed: options.seed,
            accessories: options.accessories,
            hair: options.hair,
            clothingColor: options.clothingColor,
            backgroundColor: options.backgroundColor,
            size: 120,
            randomizeIds: false,

        });

        setAvatarSrc(avatar.toDataUri())
    }, [options]);

    const handleOptionsChange = (key, value) => {
        setOptions((prevOptions) => ({...prevOptions, [key]: value }))
    }
   


    return (
        <div className='customize-container'>
           <h2>Customize my Avatar!</h2>
           <div>
            <img id={id} src={src}></img>
            <div className='customizations'>
                <label>Acessories
                    <select value={options.accessories}
                    onChange={(e) => handleOptionsChange('accessories', e.target.value)}></select>
                </label>

                
            </div>

           </div>
           <button onClick={onBack}>Change Avatar</button>
        </div>
    )


}

export default CustomizeAvatar;