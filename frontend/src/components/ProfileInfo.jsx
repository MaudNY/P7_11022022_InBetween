import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import authApi from '../api/auth';

import SettingsIcon from '@mui/icons-material/Settings';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function ProfileInfo() {

    // SHOW PROFILE
    const { id } = useParams();
    const [ profile, setProfile ] = useState([]);

    useEffect(() => {
        
        authApi.get(`/profile/${ id }`)
            .then((res) => {
                console.log("UTILISATEUR :", res.data);

                return setProfile(res.data);
            })
            .catch(error => {
                
                console.log(error);
            })
    }, [id]);

    // SHOW PROFILE SETTINGS
    const [ profileOptions, setProfileOptions ] = useState(false);

    // UPDATE PROFILE
    const [ isUpdated, setIsUpdated ] = useState(false);

    // Get input values
    const inputValues = { 
        firstName: "",
        lastName: "",
        job: "",
        department: "",
        bio: ""
    };
    const [formValues, setFormValues] = useState(inputValues);

    // Get JSON object from input values
    const setRequestBody = (e) => {
        const {name, value} = e.target;
        setFormValues({ ...formValues, [name]: value });

        console.log("FORM VALUES :", { ...formValues });

        return {...formValues};
    };

    // --- SAVE CHANGES --- //
    const saveUpdates = (e) => {
        e.preventDefault();

        const profileDetails = { ...formValues };
        console.log("PREVIOUS :", formValues);
        
        for (let name in profileDetails) {
            //console.log(`${name}: ${profileDetails[name]}`);

            if (document.getElementsByName(name)[0].value !== "" && profileDetails[name] === "") {
                const $defaultValue = document.getElementsByName(name)[0].value;
                //console.log(`Valeur formulaire  de l'input ${name}:`, profileDetails[name]);
                //console.log(`Valeur par défaut de l'input ${name}:`, $defaultValue);
                //console.log(name);
                //console.log(profileDetails);

                setFormValues({ ...formValues, [name]: $defaultValue });
                //console.log("NEW FORM ? :", formValues);
            }
        }

        console.log("NEW FORM ? :", formValues);
    };
    
    return (
        <section id="profile">
            { isUpdated === true
            ?
            <>
            <div className="profile-background">
                <button type="button" id="save-profile-btn" onClick={ saveUpdates }>Enregistrer modifications</button>
            </div>
            <div className="profile-info">
                <div className="profile-pic-block">
                    <img src={ profile.profileImageUrl } alt="" />
                </div>
                <form id="update-profile-form" method="post">
                    <div className="profile-form-block">
                        <label htmlFor="firstName">Mon prénom*</label>
                        <input type="text" defaultValue={ profile.firstName } id="firstName" name="firstName" onChange={ setRequestBody }></input>
                    </div>

                    <div className="profile-form-block">
                        <label htmlFor="lastName">Mon nom de famille*</label>
                        <input type="text" defaultValue={ profile.lastName } id="lastName" name="lastName" onChange={ setRequestBody }></input>
                    </div>

                    <div className="profile-form-block">
                        <label htmlFor="job">Mon poste</label>
                        <input type="text" defaultValue={ profile.job } id="job" name="job" onChange={ setRequestBody }></input>
                    </div>

                    <div className="profile-form-block">
                        <label htmlFor="department">Mon département</label>
                        <input type="text" defaultValue={ profile.department } id="department" name="department" onChange={ setRequestBody }></input>
                    </div>

                    <div className="profile-form-block form-block-bio">
                        <label htmlFor="bio">À propos de moi</label>
                        <textarea type="text" defaultValue={ profile.bio } id="bio" name="bio" placeholder="Dites-nous quelque chose à propos de vous..." onChange={ setRequestBody }></textarea>
                    </div>
                </form>
            </div>
            </>

            // --> IF setIsUpdated === FALSE <-- //
            :
            <>
            { profile.id === parseFloat(localStorage.getItem("userId"))
            ?
            <div className="profile-background">
                <div id="settings-icon" className="settings-icon" onClick={ (e) => setProfileOptions(true) }>
                    <SettingsIcon />
                </div>
                { profileOptions === true && (
                    <div className="settings-profile">
                        <button type="button" id="update-profile-btn" onClick={ (e) => setIsUpdated(true) }>Modifier le profil</button>
                        <div className="options-splitter"></div>
                        <button type="button" id="delete-profile-btn">Supprimer le profil</button>
                    </div>
                ) }
            </div>
            /*<div className="settings-profile">
                <button type="button" id="update-profile-btn" onClick={ (e) => setIsUpdated(true) }>Modifier profil</button>
            </div>*/
            :
            <div className="profile-background"></div>
            }
            <div className="profile-info">
                <div className="profile-pic-block">
                    <img src={ profile.profileImageUrl } alt="" />
                    { profile.id === parseFloat(localStorage.getItem("userId"))
                    ?
                    <div className="profile-pic-icon">
                        <AddAPhotoIcon />
                    </div>
                    : <></>
                    }
                </div>
                <div className="profile-name">{ profile.firstName + " " + profile.lastName }</div>
                { profile.job !== null
                ? <div className="profile-job">{ profile.job }</div>
                : <></>
                }
                { profile.department !== null
                ? <div className="profile-department">- { profile.department } -</div>
                : <></>
                }
            </div>
            <div className="profile-bio">
                    <div className="bio-title">À propos de moi</div>
                    { profile.bio !== null
                    ? <div className="bio-content">{ profile.bio }</div>
                    :
                    <div className="bio-content bio-content-replacement">
                        { profile.id === parseFloat(localStorage.getItem("userId"))
                        ? <>Dites-nous quelque chose à propos de vous...</>
                        : <>Ce membre ne s'est pas encore présenté ! <span>&#128517;</span></>
                        }
                    </div>
                    }
            </div>
            </>
            }
        </section>
      )
}
