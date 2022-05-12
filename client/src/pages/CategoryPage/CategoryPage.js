
// Modules
import { Navbar, MobileMenu, SideNav } from 'common/components';
import QuotesList from './QuotesList';

// Styles
import './styles/CategoryPage.css';
import 'common/styles/sidenav-grid.css';

export default function CategoryPage () {

    return(
        <div>
            <Navbar/>
            <MobileMenu/>
            <div className='sidenav-grid'>
                <SideNav/>
                <div className='page-content'>{/*page-content begins*/}

                    <div className='category-page'>
                        <QuotesList/>
                    </div>

                </div>{/*page-content ends*/}
            </div>
        </div>
    );
}