// Modules
import { useEffect, useState } from 'react';
import axios from "axios";
import { URL } from 'utils/rest_api.json';
import Quote from 'common/components/Quote';
import favorite_icon from 'common/images/favorite_icon.svg';

// Styles
import 'common/styles/sidenav-grid.css';
import './styles/FavoritesPage.css';


export default function FavoritesList () {

    // Component state
    const [ quotes, setQuotes ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ errors, setErrors ] = useState(false);

    useEffect(() => {
        axios.get(URL+'/quotes/favorite').then(res =>{
            if (res.status === 200){
                setQuotes(res.data.quotes);
                setIsLoading(false);
            }
        })
        .catch(err => {
            setErrors(true);
            setIsLoading(false);
        });
    }, []);


    if(isLoading){
        return(
            <div className='favorites-list'>
                Loading...
            </div>
        );
    }
    else if (errors){
        return(
            <div className='favorites-list'>
                Error!
            </div>
        );
    }
    else if(quotes.length < 1){
        return(
            <div className='favorites-list'>
                <p>You have no favorites yet!</p>
                <p>You can add quotes to favorites by clicking the <img src={favorite_icon} alt='star'></img>-icon on a quote you like.</p>
            </div>
        )
    }
    else{
        return (
            <div className='favorites-list'>
                {quotes.map((quote) =>
                    <div className='list-item' key={quote.id}>
                        <Quote {...quote}/>
                    </div>
                 )}
            </div>
        );
    }


    
};