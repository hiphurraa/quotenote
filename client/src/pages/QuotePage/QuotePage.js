// Modules
import { Navbar, MobileMenu, SideNav } from 'common/components';
import OpenedQuote from './OpenedQuote';
import { searchBarActions } from 'common/state/searchBarState';
import { useDispatch } from 'react-redux';

// Styles
import './styles/QuotePage.css';
import 'common/styles/form-styles.css';
import 'common/styles/sidenav-grid.css';
import { useEffect } from 'react';


export default function QuotePage () {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(searchBarActions.close());
    });


    return (
        <div>
            <Navbar/>
            <MobileMenu/>
            <div className='sidenav-grid'>
                <SideNav/>
                <div className='page-content'>{/*page-content begins*/}

                    <div className='quote-page'>
                        <OpenedQuote/>
                    </div>

                </div>{/*page-content ends*/}
            </div>
        </div>
    );

}