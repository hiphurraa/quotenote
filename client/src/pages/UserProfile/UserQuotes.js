// Modules
import { Quote } from 'common/components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserQuotes } from './api/userQuotesApi';

// Styles
import './styles/UserQuotes.css';

export default function UserQuotes () {

    // Component state
    const [ showQuotes, setShowQuotes ] = useState(false);

    // Redux state
    const dispatch = useDispatch();
    const userQuotesState = useSelector(state => state.userQuotesState);
    const authState = useSelector(state => state.authenticationState);

    const toggleShowQuotes = () => {
        if (!showQuotes) {
            getUserQuotes(dispatch, authState.user.id);
        }
        setShowQuotes(!showQuotes)
    }



    var hideUserQuotesLink = <div className='toggle-user-quotes' onClick={toggleShowQuotes}>Hide my quotes</div>;

    
    if(!showQuotes){
        return(
            <div className='user-quotes'>
                <div className='toggle-user-quotes' onClick={toggleShowQuotes}>Show my quotes</div>
            </div>
        );
    }

    if (userQuotesState.errors){
        //const errorMessage = userQuotesState.errors[Object.keys(userQuotesState.errors)[0]];
        return (
            <div className='user-quotes'>
                {hideUserQuotesLink}
                <h3>My quotes</h3>
                <p className='error-msg'>Error getting the quotes!</p>
            </div>
        );
    }

    else if (userQuotesState.isloading){
        return (
            <div className='user-quotes'>
                {hideUserQuotesLink}
                <h3>My quotes</h3>
                <p>Loading...</p>
            </div>
        );
    }

    else if (userQuotesState.quotes.length < 1) {
        return(
            <div className='user-quotes'>
                {hideUserQuotesLink}
                <h3>My quotes</h3>
                <p>You have not created quotes.</p>
            </div>
        )
    }

    else {
        return (
            <div className='user-quotes'>
                {hideUserQuotesLink}
                <h3>My quotes:</h3>
                <div className='user-quotes-list'>
                    {userQuotesState.quotes.map((quote) =>
                        <div className='list-item' key={quote.id}>
                            <Quote {...quote}/>
                        </div>
                    )}
                </div>

            </div>
        );
    }

}