// Modules
import { useEffect, useState } from 'react';
import axios from "axios";
import { URL } from 'utils/rest_api.json';
import Quote from 'common/components/Quote';
import { useParams } from 'react-router-dom';

// Styles
import 'common/styles/sidenav-grid.css';


export default function QuotesList () {

    // Component state
    const [ quotes, setQuotes ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ errors, setErrors ] = useState(false);

    const { category } = useParams();

    useEffect(() => {
        setErrors(false);
        setIsLoading(true);
        const categoryIds = {
            "history": 1,
            "philosophy": 2,
            "politic": 3,
            "science": 4,
            "humor": 5,
            "inspirational": 6,
            "entertainment": 7,
            "fictional": 8
        };
        const id = categoryIds[category];

        axios.get(URL+"/quotes/category/"+id)
        .then(res =>{
            if (res.status === 200){
                setQuotes(res.data.data);
                setIsLoading(false);
            }
        })
        .catch(err => {
            setErrors(true);
            setIsLoading(false);
        });
    }, [category]);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    if(isLoading){
        return(
            <div className='quotes-list'>
                <h3><span>Category: </span>{categoryName}</h3>
                <p>Loading...</p>
            </div>
        );
    }
    else if (errors){
        return(
            <div className='quotes-list'>
                <h3><span>Category: </span>{categoryName}</h3>
                Oops! Something went wrong. :(
            </div>
        );
    }
    else if(quotes.length < 1){
        return(
            <div className='quotes-list'>
                <h3><span>Category: </span>{categoryName}</h3>
                <p>Hey! This category does not have any quotes!</p>
                <p>Be sure to create one right now! :)</p>
            </div>
        )
    }
    else{
        return (
            <div className='quotes-list'>
                <h3><span>Category: </span>{categoryName}</h3>
                {quotes.map((quote) =>
                    <div className='list-item' key={quote.id}>
                        <Quote {...quote}/>
                    </div>
                 )}
            </div>
        );
    }


    
};