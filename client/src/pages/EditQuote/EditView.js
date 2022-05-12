// Modules
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { URL } from 'utils/rest_api.json';
import { updateQuote } from './api/editQuoteApi';

// Styles
import 'common/styles/form-styles.css';

export default function EditView() {

    const { id } = useParams();
    const history = useHistory();

    // Component state
    const [ isLoading, setIsLoading ] = useState(true);
    const [ failure, setFailure ] = useState(false);
    // Input fields
    const [quotetext, setQuotetext] = useState('');
    const [when, setWhen] = useState('');
    const [when_string, setWhen_string] = useState('');
    const [said_by, setSaid_by] = useState('');
    const [location, setLocation] = useState('');
    const [whenType, setWhenType] = useState("date");

    // Redux state
    const dispatch = useDispatch();
    const editQuoteState = useSelector(state => state.editQuoteState);
    const errorMessage = editQuoteState.errors[Object.keys(editQuoteState.errors)[0]];
    const authState = useSelector(state => state.authenticationState);

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
    const whenTypeNone = useRef();
    const whenRef = useRef();

    useEffect(()=>{
        // Get the quote which will be edited from the server
        axios.get(URL+"/quotes/"+id)
        .then(res => {
            if(res.data.data){
                try{
                    // If the quote does not belong to the user
                    if(authState.user.name !== res.data.data.user_name)
                        history.push("/");

                    setIsLoading(false);
                    setFailure(false);

                    // Fill the input fields with quote data
                    let quote = res.data.data;
                    setQuotetext(quote.quotetext);
                    setSaid_by(quote.said_by);
                    setLocation(quote.location);
                    if (quote.when){
                        whenTypeDate.current.defaultChecked = true;
                        setWhenType("date");
                        setWhen(quote.when.slice(0, 10));
                    }
                    else if(quote.when_string){
                        whenTypeString.current.defaultChecked = true;
                        setWhenType("string");
                        setWhen_string(quote.when_string);
                    }
                    else{
                        setWhenType("none");
                        whenTypeNone.current.defaultChecked = true;
                    }
                    if(quote.categories){
                        // Set the proper categories checkboxes checked
                        for (const ctgr of quote.categories) {
                            switch(ctgr){
                                case "history":
                                    category1.current.checked = true;
                                    break;
                                case "philosophy":
                                    category2.current.checked = true;
                                    break;
                                case "politic":
                                    category3.current.checked = true;
                                    break;
                                case "science":
                                    category4.current.checked = true;
                                    break;
                                case "humor":
                                    category5.current.checked = true;
                                    break;
                                case "inspirational":
                                    category6.current.checked = true;
                                    break;
                                case "entertainment":
                                    category7.current.checked = true;
                                    break;
                                case "fictional":
                                    category8.current.checked = true;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                }
                catch(error){
                    setFailure(true);
                }
            }
            else{
                setFailure(true);
            }
        })
        .catch(err => {
            setFailure(true);
        });
    },[id, history, authState.user.name]);

    // When the 'Save' button is clicked
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
        updateQuote(id, quote, history, dispatch);
    };

    /* LOADING SCREEEN */
    if(isLoading){
        return(<div className='edit-view'>
            <h3>Loading...</h3>
        </div>)
    }
    /* ERROR MESSAGE */
    else if (failure){
        return(<div className='edit-view'>
            <h3>Sorry! Something went wrong. Please try again.</h3>
        </div>)
    }
    /* RENDER */
    else{
        return(<div className='edit-view'>
            <form className='custom-form' onSubmit={e => e.preventDefault}>

                <h3 className='form-title'>Edit quote</h3>

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
                        <input  ref={whenTypeDate}
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

                        <input  ref={whenTypeNone}
                                type='radio' 
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
                                placeholder='Describe, when was it said...'
                                disabled={whenType === 'none'}
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
                            value={location} 
                            placeholder='The location, movie, book, etc...'
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
                </div>

                {/* SUBMIT */}
                <div className='form-field'>
                    <input  className='submit-button' 
                            onClick={handleSubmit}
                            type='submit' 
                            value='Save'>
                    </input>
                </div>

            </form>
        </div>);
    }
    
}