import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { URL } from "./rest_api.json";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { dialogActions } from 'common/state/dialogBoxState';


export default function EmailConfirmation() {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const { token } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();



    useEffect(() => {

        const continueToLoginPage = () => {
            history.push("/login");
        }

        axios.get(URL+`/users/confirmation/${token}`)
            .then((res) => {
                if(res.status === 200){
                    setIsLoading(false);
                    history.push("/login");
                    const message = "Your email was confirmed succesfully! You can now log in.";
                    dispatch(dialogActions.appear("inform", message, continueToLoginPage));
                }
            })
            .catch(err => {
                setError(true);
            });
    }, [token, dispatch, history]);

    if(error){
        return(
            <div style={{"margin": "30vh auto", "textAlign":"center"}}>
                <p style={{"marginBottom": "1rem"}}>
                    Sorry! Something went wrong with confirming the email. :(
                </p>
                <Link to="/">Link to homepage</Link>
            </div>
        )
    }
    else if(isLoading){
        return(
            <div style={{"margin": "30vh auto", "textAlign":"center"}}>
                Confirming email... Please wait.
            </div>
        )
    }
    else {
        return(
            <div>
            </div>
        );
    }

}