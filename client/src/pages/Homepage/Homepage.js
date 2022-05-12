// Modules
import QuoteCarousel from './QuoteCarousel';
import QuotesList from './QuotesList';
import { Navbar, MobileMenu, SideNav } from 'common/components/';

// Styles
import 'common/styles/sidenav-grid.css';
import './styles/Homepage.css';

export default function Homepage () {

    return (
        <div>
            <Navbar/>
            <MobileMenu/>
            <div className='sidenav-grid'>
                <SideNav/>
                <div className='page-content'>{/*page-content begins*/}

                    <div className='home-page'>
                        <h3>Top commented quotes</h3>
                        <QuoteCarousel/>
                        <h3>Recently posted quotes</h3>
                        <QuotesList/>
                    </div>

                </div>{/*page-content ends*/}
            </div>
        </div>
    );
};