// Modules
import { React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Quote } from 'common/components';
import { getQuotes } from './api/quotesListApi';
import { quotesListActions } from './state/quotesListState';

// Styles
import './styles/QuotesList.css';

function QuotesList () {

    // Redux state
    const dispatch = useDispatch();
    const quotesListState = useSelector(state => state.quotesListState);

    useEffect(()=>{
        getQuotes(dispatch);
        return function cleanup () {
            dispatch(quotesListActions.resetState());
        };
    }, [dispatch]);

    // when a quote is liked or favorited, the list will be updated with the new quote data
    const handleListUpdate = (quote, index) => {
        let quotes = quotesListState.quotes;
        quotes[index] = quote;
        quotesListActions.setQuotes(quotes);
    }

 
    if (quotesListState.isLoading){
        return (
            <div className='quotes-list'>
                <p className='loading-message'>Loading...</p>
            </div>
        );
    }

    else if (quotesListState.errors){
        return (
            <div className='quotes-list'>
                <p className='error-message'>{quotesListState.errors[Object.keys(quotesListState.errors)[0]]}</p>
            </div>
        );
    }

    else {
        return (
            <div className='quotes-list'>
                {quotesListState.quotes.map((quote, index)=>
                        <div className='list-item' key={quote.id}>
                            <Quote {...quote} handleListUpdate={handleListUpdate} index={index}/>
                        </div>
                )}
    
            </div>
        );
    }

}

export default QuotesList;