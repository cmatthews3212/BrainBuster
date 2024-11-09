import AvatarsList from './Avatars'
import { useEffect, useState, useMemo } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { useParams, useNavigate } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { adventurer, glass } from '@dicebear/collection';
import { useMutation, useApolloClient } from '@apollo/client';
import { ADD_AVATAR } from '../../utils/mutations';
import { UPDATE_AVATAR } from '../../utils/mutations';
import Auth  from '../../utils/auth';
import { GET_ME } from '../../utils/queries';




const CustomizeAvatar = ({ src, name, onClear }) => {
    const hairSeeds = ["long00", "long01", "long02", "long03", "long04", "long05","long06","long07","long08", "long09" , "long10" , "long11" , "long12" , "long13","long14","long15","long16","long17","long18","long19","long20","long21","long22","long23","long24","long25","long26","short01","short02","short03","short04","short05","short06","short07","short08","short09","short10","short11","short12","short13","short14","short15","short16" , "short17" , "short18" , "short19"]
    const hairColorSeeds = ["0e0e0e","3eac2c","6a4e35","85c2c6","796a45","562306","592454","ab2a18","ac6511","afafaf","b9a05f","cb6820","dba3be","e5d7a3"]
    const mouthSeeds = ["variant01","variant02", "variant03","variant04","variant05","variant06","variant07","variant08","variant09","variant10","variant11","variant12","variant13","variant14","variant15","variant16","variant17","variant18","variant19","variant20","variant21","variant22","variant23","variant24","variant25","variant26","variant27","variant28","variant29","variant30"]
    const eyesSeeds = ["variant01","variant02","variant03","variant04","variant05","variant06","variant07","variant08","variant09","variant10" ,"variant11" , "variant12" , "variant13" , "variant14" , "variant15" , "variant16" , "variant17" , "variant18", "variant19" , "variant20" , "variant21"  , "variant22" , "variant23" , "variant24" , "variant25" , "variant26"]
    const eyebrowSeeds = ["variant01","variant02","variant03","variant04", "variant05","variant06","variant07","variant08","variant09","variant10","variant11", "variant12", "variant13" , "variant14" , "variant15"]
    const earringsSeeds = ["variant00", "variant01","variant02","variant03","variant04","variant05","variant06"]
    const featuresSeeds = ["variant00", "birthmark","blush","freckles","mustache"]
    const glassesSeeds = ["variant00", "variant01","variant02","variant03","variant04","variant05"]
    if (!src) return null;

    const [currentSrc, setCurrentSrc] = useState(src)
    const [selectedHair, setSelectedHair] = useState("long01");
    const [selectedHairColor, setSelectedHairColor] = useState("black")
    const [selectedMouth, setSelectedMouth] = useState("variant02")
    const [selectedEyes, setSelectedEyes] = useState("variant02")
    const [selectedEyebrows, setSelectedEyebrows] = useState("variant09")
    const [selectedEarrings, setSelectedEarrings] = useState(src)
    const [earringsProb, setEarringsProb] = useState(100)
    const [selectedFeatures, setSelectedFeatures] = useState(src)
    const [featuresProb, setFeaturesProb] = useState(100)
    const [selectedGlasses, setSelectedGlasses] = useState(src)
    const [glassesProb, setGlassesProb] = useState(100)
    
    const [hairStyle, setHairStyle] = useState(false);
    const [hairColor, setHairColor] = useState(false);
    const [mouth, setMouth] = useState(false)
    const [eyes, setEyes] = useState(false)
    const [eyebrows, setEyebrows] = useState(false)
    const [earrings, setEarrings] = useState(false)
    const [features, setFeatures] = useState(false)
    const [glasses, setGlasses] = useState(false)






    useEffect(() => {
        const updatedAvatar = createAvatar(adventurer, {
            seed: name,
            size: 120,
            hairProbability: 100,
            hair: [selectedHair],
            hairColor: [selectedHairColor],
            glassesProbability: 100,
            mouth: [selectedMouth],
            eyes: [selectedEyes],
            eyebrows: [selectedEyebrows],
            earrings: [selectedEarrings],
            earringsProbability: earringsProb,
            features: [selectedFeatures],
            featuresProbability: featuresProb,
            glasses: [selectedGlasses],
            glassesProb: glassesProb,

        }).toDataUri();

        setCurrentSrc(updatedAvatar);
    }, [selectedHair, selectedHairColor, selectedMouth, selectedEyes, selectedEyebrows, selectedEarrings, selectedFeatures, selectedGlasses,earringsProb, featuresProb, glassesProb, name]);

        const hairArray = useMemo(() => {
     
            return hairSeeds.map((hair) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [selectedEyes],
                    eyebrows:  [selectedEyebrows],
                    hair: [hair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [selectedFeatures],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,
        

                }).toDataUri(),
                hair,
            }))
        }, [selectedHairColor, selectedMouth, selectedEyes, selectedEyebrows, selectedEarrings, selectedFeatures, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);
    

        const hairColorArray = useMemo(() => {
     
            return hairColorSeeds.map((color) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [color],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [selectedEyes],
                    eyebrows: [selectedEyebrows],
                    hair: [selectedHair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [selectedFeatures],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,


                }).toDataUri(),
                color,
            }))
        }, [selectedHair, selectedMouth, selectedEyes, selectedEyebrows, selectedEarrings, selectedFeatures, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);

        const mouthArray = useMemo(() => {
     
            return mouthSeeds.map((mouth) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [mouth],
                    eyes: [selectedEyes],
                    eyebrows: [selectedEyebrows],
                    hair: [selectedHair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [selectedFeatures],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,


                }).toDataUri(),
                mouth,
            }))
        }, [selectedHair, selectedHairColor, selectedEyes, selectedEyebrows, selectedEarrings, selectedFeatures, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);

        const eyesArray = useMemo(() => {
     
            return eyesSeeds.map((eyes) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [eyes],
                    eyebrows: [selectedEyebrows],
                    hair: [selectedHair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [selectedFeatures],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,



                }).toDataUri(),
                eyes,
            }))
        }, [selectedHair, selectedHairColor, selectedMouth, selectedEyebrows, selectedEarrings, selectedFeatures, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);

        const eyebrowsArray = useMemo(() => {
     
            return eyebrowSeeds.map((eyebrows) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [selectedEyes],
                    eyebrows: [eyebrows],
                    hair: [selectedHair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [selectedFeatures],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,


                }).toDataUri(),
                eyebrows,
            }))
        }, [selectedHair, selectedHairColor, selectedMouth,selectedEyes, selectedEarrings, selectedFeatures, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);

        const earringsArray = useMemo(() => {
     
            return earringsSeeds.map((earrings) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [selectedEyes],
                    eyebrows: [selectedEyebrows],
                    hair: [selectedHair],
                    earrings: [earrings],
                    earringsProbability: earringsProb,
                    features: [selectedFeatures],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,


                }).toDataUri(),
                earrings,
            }))
        }, [selectedHair, selectedHairColor, selectedMouth,selectedEyes, selectedEyebrows, selectedFeatures, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);

        const featuresArray = useMemo(() => {
     
            return featuresSeeds.map((features) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [selectedEyes],
                    eyebrows: [selectedEyebrows],
                    hair: [selectedHair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [features],
                    featuresProbability: featuresProb,
                    glasses: [selectedGlasses],
                    glassesProbability: glassesProb,


                }).toDataUri(),
                features,
            }))
        }, [selectedHair, selectedHairColor, selectedMouth,selectedEyes, selectedEyebrows, selectedEarrings, earringsProb, featuresProb, selectedGlasses, glassesProb, name]);

        const glassesArray = useMemo(() => {
     
            return glassesSeeds.map((glasses) => ({
               src: createAvatar(adventurer, {
                    seed: name,
                    size: 120,
                    hairProbability: 100,
                    hairColor: [selectedHairColor],
                    glassesProbability: 0,
                    mouth: [selectedMouth],
                    eyes: [selectedEyes],
                    eyebrows: [selectedEyebrows],
                    hair: [selectedHair],
                    earrings: [selectedEarrings],
                    earringsProbability: earringsProb,
                    features: [features],
                    featuresProbability: featuresProb,
                    glasses: [glasses],
                    glassesProbability: glassesProb,


                }).toDataUri(),
                glasses,
            }))
        }, [selectedHair, selectedHairColor, selectedMouth,selectedEyes, selectedEyebrows, selectedEarrings, earringsProb, featuresProb, selectedFeatures, glassesProb, name]);
        
        const handleHairClick = (hair) => {
            setSelectedHair(hair)
            window.scrollTo({ top: 0, behavior: 'smooth' })
      
        }
       
        const handleHairColorClick = (color) => {
            setSelectedHairColor(color)
            window.scrollTo({ top: 0, behavior: 'smooth' })
           
        }

        const handleMouthClick = (mouth) => {
            setSelectedMouth(mouth)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const handleEyesClick = (eyes) => {
            setSelectedEyes(eyes)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const handleEyebrowsClick = (eyebrows) => {
            setSelectedEyebrows(eyebrows)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const handleEarringsClick = (earrings) => {
            setSelectedEarrings(earrings)
            window.scrollTo({ top: 0, behavior: 'smooth' })
           
        }

        const handleFeaturesClick = (features) => {
            setSelectedFeatures(features)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const handleGlassesClick = (glasses) => {
            setSelectedGlasses(glasses)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        const handleToggleHair = () => {
            setHairStyle(!hairStyle);
            if (hairColor) setHairColor(false);
            if (mouth) setMouth(false);
            if (eyes) setEyes(false);
            if (eyebrows) setEyebrows(false);
            if (earrings) setEarrings(false);
            if (features) setFeatures(false);
            if (glasses) setGlasses(false);
        };
        
        const hanldeToggleColor = () => {
            setHairColor(!hairColor);
            if (hairStyle) setHairStyle(false);
            if (mouth) setMouth(false);
            if (eyes) setEyes(false);
            if (eyebrows) setEyebrows(false);
            if (earrings) setEarrings(false);
            if (features) setFeatures(false);
            if (glasses) setGlasses(false);
        };
        
        const handleToggleMouth = () => {
            setMouth(!mouth);
            if (hairColor) setHairColor(false);
            if (hairStyle) setHairStyle(false);
            if (eyes) setEyes(false);
            if (eyebrows) setEyebrows(false);
            if (earrings) setEarrings(false);
            if (features) setFeatures(false);
            if (glasses) setGlasses(false);
        };
        
        const hanldeToggleEyes = () => {
            setEyes(!eyes);
            if (hairColor) setHairColor(false);
            if (hairStyle) setHairStyle(false);
            if (mouth) setMouth(false);
            if (eyebrows) setEyebrows(false);
            if (earrings) setEarrings(false);
            if (features) setFeatures(false);
            if (glasses) setGlasses(false);
        };
        
        const handleToggleEyebrows = () => {
            setEyebrows(!eyebrows);
            if (hairColor) setHairColor(false);
            if (hairStyle) setHairStyle(false);
            if (mouth) setMouth(false);
            if (eyes) setEyes(false);
            if (earrings) setEarrings(false);
            if (features) setFeatures(false);
            if (glasses) setGlasses(false);
        };
        
        const handleToggleEarrings = () => {
            setEarrings(!earrings);
            if (hairColor) setHairColor(false);
            if (hairStyle) setHairStyle(false);
            if (mouth) setMouth(false);
            if (eyes) setEyes(false);
            if (eyebrows) setEyebrows(false);
            if (features) setFeatures(false);
            if (glasses) setGlasses(false);
        };
        
        const handleToggleFeatures = () => {
            setFeatures(!features);
            if (hairColor) setHairColor(false);
            if (hairStyle) setHairStyle(false);
            if (mouth) setMouth(false);
            if (eyes) setEyes(false);
            if (eyebrows) setEyebrows(false);
            if (earrings) setEarrings(false);
            if (glasses) setGlasses(false);
        };
        
        const handleToggleGlasses = () => {
            setGlasses(!glasses);
            if (hairColor) setHairColor(false);
            if (hairStyle) setHairStyle(false);
            if (mouth) setMouth(false);
            if (eyes) setEyes(false);
            if (eyebrows) setEyebrows(false);
            if (earrings) setEarrings(false);
            if (features) setFeatures(false);
        };

        const handleNoEarrings = () => {
            setEarringsProb(0)
        }
       

        const navigate = useNavigate();
        
        const [addAvatar] = useMutation(ADD_AVATAR) 
        const handleCreateAvatar = async () => {
            const token = Auth.loggedIn() ? Auth.getToken() : null;

            if (!token) {
                return false;

            }
            try {
                const { data } =  await addAvatar({
                    variables: {
                        userId: Auth.getProfile().data._id,
                        avatar: {
                            src: currentSrc
                        }
                    }
                });

                console.log('Avatar added successfully')
                navigate('/profile')
            } catch (err) {
                console.error("error creating avatar", err)
            }
        }

        const client = useApolloClient();

        const [updateAvatar] = useMutation(UPDATE_AVATAR, {
            refetchQueries: [{query: GET_ME}],
            awaitRefetchQueries: true,
            onCompleted: (data) => {
                if (data.updateAvatar) {
                    client.cache.modify({
                        fields: {
                            me(existingUser = {}) {
                                return { ...existingUser,
                                    avatar: {...existingUser.avatar, src: data.updateAvatar.src} }
                            }
                        }
                    })
                }
            }
        });
        
        const handleUpdateAvatar = async (newAvatarSrc) => {
            // console.log(newAvatarSrc)
            try {
                await updateAvatar({ variables: 
                    {userId: Auth.getProfile().data._id,
                    avatar: {
                        src: newAvatarSrc
                    }
                }
                });
                navigate('/profile')
            } catch (err) {
                console.error('error updating avatar', err)
            }
        };
    
   

    return (
        <div className='customize-container'
        style={{
            width: '75%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
       
           <div className='cust-top'>
                <div className='changeBtns'
                style={{
                   
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                <button className="changeBtn" onClick={onClear}>Change Avatar Base</button>
                {
                    currentSrc ? (
                        <>
                    <button onClick={() => handleUpdateAvatar(currentSrc)} className='changeBtn'>Create Avatar</button>
                        </>
                    ) : (
                        <>
                        <button onClick={() => handleCreateAvatar(currentSrc)} className='changeBtn'>Create Avatar</button>

                        </>
                    )
                }
                </div>
                <div className='avatar-select-container'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    <img id='avatar-select' key={currentSrc} name={name} src={currentSrc}
                    style={{
                        width: '30%'
                    }}
                    ></img>
                </div>
           </div>
        
        <div className='scroll-container'
        style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            width: '50%',
            height: 'auto',
            padding: '10px',
            border: '2px solid white',

          

            
        }}>
            <div className='customizations'>
                <button className='customizeBtn' onClick={handleToggleHair}>{hairStyle ? 'Select' : ''} Hair Style</button>
               
                <button className='customizeBtn' onClick={hanldeToggleColor}>{hairColor ? 'Select' : ''} Hair Color</button>
                
                 <button className='customizeBtn' onClick={handleToggleMouth}>{mouth ? 'Select' : ''} Mouth </button>
             
                  <button className='customizeBtn' onClick={hanldeToggleEyes}>{eyes ? 'Select' : ''} Eyes </button>
               
                    <button className='customizeBtn' onClick={handleToggleEyebrows}>{eyebrows ? 'Select' : ''} Eyebrows </button>
             
                   <button className='customizeBtn' onClick={handleToggleEarrings}>{earrings ? 'Select' : ''} Earrings </button>
             
                   <button className='customizeBtn' onClick={handleToggleFeatures}>{features ? 'Select' : ''} Features </button>
             
                   <button className='customizeBtn' onClick={handleToggleGlasses}>{glasses ? 'Select' : ''} Glasses </button>
            
                
            </div>
        </div>
            <div className='selections-container'>
            {hairStyle && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {hairArray.map((hair) => (
                        <img  onClick={() => handleHairClick(hair.hair)}  name={hair.seed} className='avatar-hair-list' src={hair.src}></img>
                    ))} 
                    

                </div>
                )}
                {hairColor && (
                <div className='selections'>
                    {/* <h2>Hair Color</h2> */}
                {hairColorArray.map((color) => (
                        <img  onClick={() => handleHairColorClick(color.color)}  name={color.seed} className='avatar-hair-list' src={color.src}></img>
                    ))} 

                </div>
                )}
                    {mouth && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {mouthArray.map((mouth) => (
                        <img  onClick={() => handleMouthClick(mouth.mouth)}  name={mouth.seed} className='avatar-hair-list' src={mouth.src}></img>
                    ))} 

                </div>
                )}
                  {eyes && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {eyesArray.map((eyes) => (
                        <img  onClick={() => handleEyesClick(eyes.eyes)}  name={eyes.seed} className='avatar-hair-list' src={eyes.src}></img>
                    ))} 

                </div>
                )}
                    {eyebrows && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {eyebrowsArray.map((eyebrows) => (
                        <img  onClick={() => handleEyebrowsClick(eyebrows.eyebrows)}  name={eyebrows.seed} className='avatar-hair-list' src={eyebrows.src}></img>
                    ))} 

                </div>
                )}
                    {earrings && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {earringsArray.map((earrings) => (
                        <img  onClick={() => handleEarringsClick(earrings.earrings)}  name={earrings.seed} className='avatar-hair-list' src={earrings.src}></img>
                    ))} 
                  
                </div>
                )}
                    {features && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {featuresArray.map((features) => (
                        <img  onClick={() => handleFeaturesClick(features.features)}  name={features.seed} className='avatar-hair-list' src={features.src}></img>
                    ))} 

                </div>
                )}
                     {glasses && (
                <div className='selections'>
                    {/* <h2>Hair Style</h2> */}
                {glassesArray.map((glasses) => (
                        <img  onClick={() => handleGlassesClick(glasses.glasses)}  name={glasses.seed} className='avatar-hair-list' src={glasses.src}></img>
                    ))} 

                </div>
                )}
            </div>

           </div>
      
    )


}

export default CustomizeAvatar;