// Modules
import { dialogActions } from 'common/state/dialogBoxState';
import { useSelector, useDispatch } from 'react-redux';

//Styles
import './styles/DialogBox.css';

export default function DialogBox (props) {

    //Redux state
    const dispatch = useDispatch();
    const dialogBoxState = useSelector(state => state.dialogBoxState);

    // Button style
    var buttonCSS = "";
    switch(dialogBoxState.dialogType){
        case 'confirm':
            buttonCSS = 'confirm-button';
            break;
        case 'confirm-delete':
            buttonCSS = 'delete-button';
            break;
        case 'inform':
            buttonCSS = 'ok-button';
            break;
        default:
            break;
    }

    // Execute the callback function
    const proceed = () => {
        if(dialogBoxState.parameter){
            dialogBoxState.callBackFunction(dialogBoxState.parameter);
        }
        else{
            dialogBoxState.callBackFunction();
        }
        dispatch(dialogActions.reset());
    }

    // Close the dialog
    const cancel = () => {
        dispatch(dialogActions.reset());
    }

    if (dialogBoxState.show){
        return(
            <div className='dialog-container'>
                <div className='dialog-content'>

                    <div className='question-text'>{dialogBoxState.message}</div>
    
                    {(dialogBoxState.dialogType === "inform")?
                    <div>
                        <button onClick={proceed} className={buttonCSS}>
                            Ok
                        </button>
                    </div>
                    :
                    <div>
                        <button onClick={proceed} className={buttonCSS}>
                            Yes
                        </button>
        
                        <button onClick={cancel} className='cancel-button'>
                            No
                        </button>    
                    </div>
                    }

                    
                </div>
            </div>
        );
    }
    else {
        return(
            <div></div>
        );
    }

    

};

