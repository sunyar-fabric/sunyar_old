import React from 'react';
import { useHistory } from 'react-router';
import logo from '../../static/image/logo-footer.png';


const Footer = () => {

    const history = useHistory()

    return (
        <footer className='header-theme d-flex justify-content-center align-items-center'>
            <div className="d-flex flex-column border-left px-3 my-2">
                <strong className="text-white p-0 m-0">مرکز نوآوری بهسازان فردا</strong>
                <p className="text-white font-size-09rem p-0 m-0">کليه حقوق اين سايت متعلق به مرکز نوآوري پل وينو مي باشد</p>
            </div> 
            <img src={logo} className="mr-3" alt="لوگوی پولوینو" />
        </footer>
    );
}

export default Footer;

