// Modules
import { useState } from 'react';
import Quote from 'common/components/Quote';
import back_btn_icon from 'common/images/back_btn_icon.svg';
import next_btn_icon from 'common/images/next_btn_icon.svg';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuotes } from './api/quoteCarouselApi';
import { quoteCarouselActions } from './state/quoteCarouselState';

// Styles
import './styles/QuoteCarousel.css';

export default function QuoteCarousel () {


    // Component state
    const [ quoteIndex, setQuoteIndex ] = useState(0);
    const [ buttonsEnabled, setButtonsEnabled ] = useState(true);
    const [ quoteContainerCSS, setQuoteContainerCSS ] = useState("quote-container"); // used to trigger css animation
    const [render, setRender] = useState(true);

    // Redux state
    const dispatch = useDispatch();
    const carouselState = useSelector(state => state.quoteCarouselState);
    var quotes = carouselState.quotes;

    useEffect(()=>{
        getQuotes(dispatch);
        return function cleanup () {
            dispatch(quoteCarouselActions.resetState());
        };
    }, [dispatch]);

    const reRenderQuote = () => {
        setRender(false)
        setRender(true);
    }

    // Carousel -- next quote
    const nextQuote = () => {
        // Don't allow the button action when animation in unfinished
        if(!buttonsEnabled) return;
        setButtonsEnabled(false);

        // Trigger animation with css class
        setQuoteContainerCSS("quote-container animate-next") 

        setTimeout(()=>{ // Change the quote index while the quote is hidden
            if (quoteIndex < quotes.length-1){
                setQuoteIndex(quoteIndex+1);
            }
            else {
                setQuoteIndex(0);
            }
            reRenderQuote();
        }, 120);

        setTimeout(()=>{ // Enable the buttons after animation has finished
            setButtonsEnabled(true);
            setQuoteContainerCSS("quote-container");
        }, 600);
    }


    // Carousel -- previous quote
    const previousQuote = () => {
        // Don't allow the button action when animation in unfinished
        if (!buttonsEnabled) return;
        setButtonsEnabled(false);

        // Trigger animation with css class
        setQuoteContainerCSS("quote-container animate-previous"); 

        setTimeout(()=>{ // Change the quote index while the quote is hidden
            if (quoteIndex > 0){
                setQuoteIndex(quoteIndex-1);
            }
            else {
                setQuoteIndex(quotes.length-1);
            }
            reRenderQuote();
        }, 120);

        setTimeout(()=>{// Enable the buttons after animation has finished
            setButtonsEnabled(true);
            setQuoteContainerCSS("quote-container");
        }, 600);
    }

    // when a quote is liked or favorited, the list will be updated with the new quote data
    const handleListUpdate = (quote, index) => {
        let quotes = carouselState.quotes;
        quotes[index] = quote;
        quoteCarouselActions.setQuotes(quotes);
    }


    if (carouselState.errors){
        const errorMessage = carouselState.errors[Object.keys(carouselState.errors)[0]];
        return (
            <div className='quote-carousel'>
                <p className='error-msg'>{errorMessage}</p>
            </div>
        );
    }
    else if (carouselState.isLoading){
        return (
            <div className='quote-carousel'>
                <p>Loading...</p>
            </div>
        );
    }
    else {
        return (
            <div className='quote-carousel'>
                <img src={back_btn_icon} className='previous-btn' alt='back' onClick={previousQuote}></img>
                <div className='carousel-container'>
                    <div className={quoteContainerCSS}>
                        {(render)? <Quote {...quotes[quoteIndex]} handleListUpdate={handleListUpdate} index={quoteIndex}/> : ''}
                    </div>
                </div>
                <img src={next_btn_icon} className='next-btn' alt='next' onClick={nextQuote}></img>
            </div>
        );
    }
}