// Modules
import { Navbar, MobileMenu, SideNav } from 'common/components';
import EditView from './EditView';

// Styles
import './styles/EditQuote.css';
import 'common/styles/sidenav-grid.css';

export default function EditQuote() {
    return(
        <div>
            <Navbar/>
            <MobileMenu/>
            <div className='sidenav-grid'>
                <SideNav/>
                <div className='page-content'>{/*page-content begins*/}

                    <div className='edit-quote'>
                        <EditView/>
                    </div>

                </div>{/*page-content ends*/}
            </div>
        </div>
    );
}