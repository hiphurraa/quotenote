//Modules
import popup_menu_icon from 'common/images/popup_menu_icon.svg';
import { useEffect, useState, useRef } from 'react';
import delete_icon from 'common/images/delete_icon.svg';
import edit_icon from 'common/images/edit_icon.svg';
import report_icon from 'common/images/report_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { dialogActions } from 'common/state/dialogBoxState';
import { removeQuote } from './api/quotePageApi';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


//Styles
import './styles/PopupMenu.css';


/**
 * Hook that closes the popup-menu, when clicked outside of it
 */
function useOutsideAlerter(ref, closeMenu) {
    useEffect(() => {
        // Perform the passed function
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                closeMenu();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, closeMenu]);
}



export default function PopupMenu () {

    //redux state
    const dispatch = useDispatch();
    const user = useSelector(state => state.authenticationState.user);
    let { user_id } = useSelector(state => state.quotePageState.quote);
    const authState = useSelector(state => state.authenticationState);
    const roles = authState.user.roles;

    // component state
    const [showMenu, setShowMenu] = useState(false);

    const history = useHistory();

    // Close the popup-menu if clicked outside of it
    const wrapperRef = useRef(null);
    const closeMenu = () => {
        setShowMenu(false);
    }
    useOutsideAlerter(wrapperRef, closeMenu);

    // Delete the quote
    const { id } = useParams();
    const deleteQuote = () => {
        removeQuote(id, history, dispatch);
        dispatch(dialogActions.appear("inform", "The quote was deleted succesfully.", ()=>{history.push("/")}));
    }

    // Verify, if the user wants to delete the quote
    const verifyDelete = () => {
        dispatch(dialogActions.appear("confirm-delete", "Are you sure you want to delete the quote?", deleteQuote));
    }

    return(
        <div ref={wrapperRef} className='popup-menu-container'>

            <img
                className='menu-toggle-button'
                onClick={e => setShowMenu(!showMenu)}
                src={popup_menu_icon}
                alt='open menu'>
            </img>

            <div className={showMenu? "popup-menu": "popup-menu hide"}>

                <div className={(user.id === user_id)? 'delete-link' : 'hide'}
                    onClick={e => verifyDelete()}>

                    <img    src={delete_icon}
                            alt="delete">
                    </img>
                    Delete
                </div>

                {/*Show this delete-link if not own quote and user has admin or moderator role. Sorry for horrible code :)*/}
                <div className={((user.id !== user_id) && (roles && (roles.includes("admin") || roles.includes("moderator"))))? 'delete-link admin-moderator': 'hide'}
                    onClick={e => verifyDelete()}>
                    <img    src={delete_icon}
                            alt="delete">
                    </img>
                    (Delete)
                </div>
                
                <div className={(user.id === user_id) ? 'edit-link': 'hide'}
                    onClick={e => history.push("/quote/edit/"+id)}>

                    <img src={edit_icon}
                        alt="edit">
                    </img>
                    Edit
                </div>

                <div className={(user.id !== user_id) ? 'report-link': 'hide'}>
                    <img src={report_icon}
                        alt="edit">
                    </img>
                    Report
                </div>

            </div>
        </div>
    );
}