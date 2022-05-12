// Modules
import { React, useRef, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SideNav, Navbar, MobileMenu } from 'common/components/';
import { createQuote } from './api/createQuoteApi';

// Styles
import './styles/CreateQuote.css'
import 'common/styles/sidenav-grid.css';
import 'common/styles/form-styles.css';

export default function CreateQuote () {

    const history = useHistory();

    // Component state
    const [quotetext, setQuotetext] = useState('');
    const [when, setWhen] = useState('');
    const [when_string, setWhen_string] = useState('');
    const [said_by, setSaid_by] = useState('');
    const [location, setLocation] = useState('');
    const [whenType, setWhenType] = useState("date");

    // Redux state
    const dispatch = useDispatch();
    const createQuoteState = useSelector(state => state.createQuoteState);
    const authState = useSelector(state => state.authenticationState);
    const errorMessage = createQuoteState.errors[Object.keys(createQuoteState.errors)[0]];

    // References
    const category1 = useRef();
    const category2 = useRef();
    const category3 = useRef();
    const category4 = useRef();
    const category5 = useRef();
    const category6 = useRef();
    const category7 = useRef();
    const category8 = useRef();
    const whenTypeDate = useRef();
    const whenTypeString = useRef();
    const whenRef = useRef();

    // Gather data for the quote and send it to server to create a new quote
    const handleSubmit = (e) => {
        e.preventDefault();
        const categories = [];
        if (category1.current.checked) categories.push(1);
        if (category2.current.checked) categories.push(2);
        if (category3.current.checked) categories.push(3);
        if (category4.current.checked) categories.push(4);
        if (category5.current.checked) categories.push(5);
        if (category6.current.checked) categories.push(6);
        if (category7.current.checked) categories.push(7);
        if (category8.current.checked) categories.push(8);
        let quote = { quotetext, said_by, location, categories };
        if (whenType === 'date') {
            const date = new Date(when);
            var day = 60 * 60 * 24 * 1000;
            quote.when = new Date(date.getTime() + day);
        }
        else if (whenType === 'string') quote.when_string = when_string;
        createQuote(quote, history, dispatch);
    };

    if (authState.isAuthenticated){
        return(
            <div>
                <Navbar/>
                <MobileMenu/>
                <div className='sidenav-grid'>
                    <SideNav/>
                    <div className='page-content'>{/*page-content begins*/}

                        <div className='create-quote'>

                            <form className='custom-form' onSubmit={e => e.preventDefault}>

                            <h3 className='form-title'>Create a new quote</h3>

                                {/* QUOTEPHRASE */}
                                <fieldset className='form-field'><legend>What was said? *</legend>
                                    <textarea   autoFocus 
                                                id='quotetext-input' 
                                                value={quotetext} 
                                                onChange={e => setQuotetext(e.target.value)} 
                                                rows="5" 
                                                placeholder='The quote itself...'>
                                    </textarea>
                                </fieldset>

                                {/* SAID_BY */}
                                <fieldset className='form-field'><legend>Who said it? *</legend>
                                    <input  type='text'
                                            value={said_by} 
                                            onChange={e => setSaid_by(e.target.value)}
                                            placeholder='The person who said it...'>
                                    </input>
                                </fieldset>

                                 {/* WHEN */}
                                <fieldset className='form-field'>
                                    {/* WHEN TYPE */}
                                    <legend className='when-options'>When was it said?
                                        <input  defaultChecked
                                                ref={whenTypeDate}
                                                type='radio' 
                                                value='date' 
                                                name='when-type' 
                                                id='when-date' 
                                                onChange={e => setWhenType(e.target.value)}>
                                        </input>
                                        <label>date</label>

                                        <input  ref={whenTypeString}
                                                type='radio' 
                                                value='string' 
                                                name='when-type' 
                                                id='when-string' 
                                                onChange={e => setWhenType(e.target.value)}>
                                        </input>
                                        <label>text</label>

                                        <input  type='radio' 
                                                value='none' 
                                                name='when-type' 
                                                id='when-none' 
                                                onChange={e => setWhenType(e.target.value)}>
                                        </input>
                                        <label>none</label>
                                    </legend>
                                    {/* WHEN INPUT */}
                                    {(whenType === 'string')?
                                        <input  type='text' 
                                                disabled={whenType === 'none'}
                                                placeholder='Describe, when was it said...'
                                                value={when_string} 
                                                onChange={e => setWhen_string(e.target.value)}/>
                                        :
                                        <input  type="date" 
                                                disabled={whenType === 'none'}
                                                ref={whenRef}
                                                name='when' 
                                                id='when-input' 
                                                value={when} 
                                                onChange={e => setWhen(e.target.value)}></input>
                                    }
                                </fieldset>

                                {/* LOCATION */}
                                <fieldset className='form-field'><legend>Where was it said?</legend>
                                    <input  type='text' 
                                            placeholder='The location, movie, book, etc...'
                                            value={location} 
                                            onChange={e => setLocation(e.target.value)}>
                                    </input>
                                </fieldset>

                                {/* CATEGORIES */}
                                <fieldset className='form-field categories'><legend>Choose categories</legend>
                                    <div className='category-option'>
                                        <input  type='checkbox' value={1} id='category1' ref={category1}/>
                                        <label htmlFor='category1'>History</label>
                                    </div>

                                    <div className='category-option'>
                                        <input  type='checkbox' value={2} id='category2' ref={category2}/>
                                        <label htmlFor='category2'>Philosophy</label>
                                    </div>
                                    
                                    <div className='category-option'>
                                        <input  type='checkbox' value={3} id='category3' ref={category3}/>
                                        <label htmlFor='category3'>Politic</label>
                                    </div>

                                    <div className='category-option'>
                                        <input  type='checkbox' value={4} id='category4' ref={category4}/>
                                        <label htmlFor='category4'>Science</label>
                                    </div>

                                    <div className='category-option'>
                                        <input  type='checkbox' value={5} id='category5' ref={category5}/>
                                        <label htmlFor='category5'>Humor</label>
                                    </div>

                                    <div className='category-option'>
                                        <input  type='checkbox' value={6} id='category6' ref={category6}/>
                                        <label htmlFor='category6'>Inspirational</label>
                                    </div>

                                    <div className='category-option'>
                                        <input  type='checkbox' value={7} id='category7' ref={category7}/>
                                        <label htmlFor='category7'>Entertainment</label>
                                    </div>

                                    <div className='category-option'>
                                        <input  type='checkbox' value={8} id='category8' ref={category8}/>
                                        <label htmlFor='category8'>Fictional</label>
                                    </div>
                                </fieldset>

                                {/* ERROR MESSAGE */}
                                <div className='form-field'>
                                    <p className='error-message'>{errorMessage}</p>
                                    {createQuoteState.isLoading? <div className='loading-message'>Loading...</div> : ''}
                                </div>

                                {/* SUBMIT */}
                                <div className='form-field'>
                                    <input  className='submit-button' 
                                            onClick={handleSubmit}
                                            type='submit' 
                                            value='Create'>
                                    </input>
                                </div>

                            </form>
                        </div>
        
                    </div>{/*page-content ends*/}
                </div>
            </div>
        );
    }
    else {
        return(
            <Redirect to="/login" />
        );
    }

}