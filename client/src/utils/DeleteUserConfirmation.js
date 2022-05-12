// Modules
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { URL } from 'utils/rest_api.json';
import { dialogActions } from 'common/state/dialogBoxState';
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import { logoutUser } from 'common/api/loginUserApi';

export default function DeleteUserConfirmation () {

    // Component state
    const [ password, setPassword ] = useState();
    const [ highlightAgreement, setHighlightAgreement ] = useState(false);

    const agreeCheckbox = useRef();
    const history = useHistory();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.authenticationState);
    const userId = authState.user.id;
    if (!userId)
        history.push("/login");



    /* STYLES */
    const divStyle = {
        display: "flex",
        flexDirection: "column",
        maxWidth: "60ch",
        alignItems: "center",
        margin: "1rem auto",
        border: "solid gray 1px",
        borderRadius: ".5rem",
        backgroundColor: "#f9faf9",
        padding: "1rem",
    }

    const inputStyle = {
        marginTop:"1rem",
        width: "95%"
    };

    const deleteButtonStyle = {
        marginTop: "1rem",
        padding: ".4rem",
        cursor: "pointer",
        backgroundColor: "#eb4034",
        borderRadius: ".2rem",
        border: "none",
        color:"white"
    }

    const cancelButtonStyle = {
        marginTop: "1rem",
        padding: ".4rem",
        cursor: "pointer",
        backgroundColor: "#767d75",
        borderRadius: ".2rem",
        border: "none",
        color:"white"
    }

    const informationBoxStyle = {
        border: "solid gray 1px",
        padding: ".5rem",
        marginBottom: "1rem",
        backgroundColor: "white"
    }

    const deletedUserStyle = {
            backgroundColor: "#dde2dd",
            color: "rgb(110, 119, 110)",
            borderRadius: ".5rem",
            padding: "0 .2rem",
            fontWeight: "bold"
    }

    if (highlightAgreement)
        informationBoxStyle.boxShadow = "0 0 .1rem .1rem red";

    // Request server to delete the user and inform user of success or failure
    const deleteAccount = () => {
        axios.put(URL+"/users/delete/"+userId, {password})
        .then(res =>{
            if (res.status === 200){
                // Logout user and redirect to homepage
                logoutUser(dispatch, history);
                // Inform user of succesful delete
                dispatch(dialogActions.appear("inform", "Your account has been deleted.", ()=>{}));
            }
            else{
                dispatch(dialogActions.appear("inform", "Sorry! Something went wrong with deleting your user account.", ()=>{
                    history.push("/profile");
                }));
            }
        })
        .catch(err => {
            dispatch(dialogActions.appear("inform", "Sorry! Something went wrong with deleting your user account.", ()=>{
                history.push("/profile");
            }));
        });
    }

    /*RENDER*/
    return(<div style={divStyle}>
        <h4 style={{color: "black", marginBottom:"1rem"}}>Delete QuoteNote account</h4>
        <div style={informationBoxStyle}>
            <p>Deleting the account will not delete quotes, comments or likes made by the user. </p>
            <p style={{marginTop:".5rem"}}>After deleting, the username will be shown as <span style={deletedUserStyle}>(deleted user)</span>.</p>
            <p style={{marginTop:".5rem"}}>You will not be able to recover your account once it's deleted.</p>
            <div style={{marginTop:"1rem"}}>
                <input type='checkbox' ref={agreeCheckbox} style={{cursor:"pointer"}} id='understand-check' onChange={e=>setHighlightAgreement(false)}/>
                <label style={{marginLeft:".5rem", cursor:"pointer"}} for='understand-check'>Yes, I understand</label>
            </div>
        </div>
        <p>Enter your password to delete your QuoteNote account:</p>
        <input autoFocus style={inputStyle} type='password' value={password} onChange={e=>{setPassword(e.target.value)}}></input>
        <button style={deleteButtonStyle} onClick={e=>{
            if (agreeCheckbox.current.checked) deleteAccount();
            else setHighlightAgreement(true);
        }}>Delete account permanently</button>
        <button style={cancelButtonStyle} onClick={e=>history.push("/profile")}>Cancel</button>
    </div>)
}