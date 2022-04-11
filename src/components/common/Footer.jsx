import React from 'react';
import logo from '../../static/image/logo-footer.png';

const Footer = () => {
    return (
        <footer className='footer-theme d-flex justify-content-center align-items-center'>

            <div className="d-flex flex-column col-md-6 border-left px-3 my-2">
                <strong className="text-white font-size-08rem p-0 m-0">مرکز نوآوری بهسازان فردا</strong>
                <p className="text-white font-size-06rem p-0 m-0">کليه حقوق اين سايت متعلق به مرکز نوآوري پل وينو مي باشد</p>
            </div>
            <div className="d-flex col-md-6 pr-0">
                <img src={logo} className="mr-3" alt="لوگوی پولوینو" />
            </div>
        </footer>
    );
}

export default Footer;

