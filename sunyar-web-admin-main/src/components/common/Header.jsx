import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../../static/image/logo-header.png';
import { useTranslation, initReactI18next } from "react-i18next";
import fa_flag from '../../static/image/iran-flag.png';
import en_flag from '../../static/image/united-kingdom-flag.png';
import i18next from 'i18next';



function handleChangeEn() {
    i18next.changeLanguage('en') 
    document.body.dir='ltr'
}

function handleChangeFa() {
    i18next.changeLanguage('fa') 
    document.body.dir='rtl'
}

const Header = () => {
    const history = useHistory()

    function handleClose() {
        localStorage.clear()
        history.push('/login')
    }

    useEffect(() => {
    }, [])

    const { t } = useTranslation()

    return (
        <header className='header-theme '>
            <div className='d-flex justify-content-between '>
                <div className="d-flex align-items-center align-baseline">
                    <i className="fa fa-user text-white fa-2x px-2 py-1 mx-2 rounded-pill user-logo-bg"></i>
                    <p className="text-white mr-2 mt-3"> {localStorage.getItem('name')} {localStorage.getItem('family')} {t('welcome_message')}  </p>
                    <p className=" mr-2 mt-3 cursor-pointer text-white px-0 " >|</p>
                    <p className=" mr-2 mt-3 cursor-pointer  px-0 " onClick={handleClose} style={{ color: 'rgb(74 127 185)' }}>{t('exit')}</p>
                </div>

                <div className='d-flex align-items-center'>
                    <div className="dropdown languege-style mx-1" >
                        <a className="btn dropdown-toggle languege-style "  href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            {t('select-languege')}
                        </a>
                        <ul className="dropdown-menu text-right" aria-labelledby="dropdownMenuLink">
                            <li><button onClick={()=>handleChangeEn()} className="dropdown-item text-dark" href="#"><img src={en_flag} className='flag-style' /> English</button></li>
                            <li><button onClick={()=>handleChangeFa()} className="dropdown-item text-dark" href="#"><img src={fa_flag} className='flag-style' /> فارسی</button></li>
                        </ul>
                    </div>
                    <img className="p-0 mx-2 " src={logo} alt="لوگوی سانیار" />

                </div>
            </div>
        </header>);
}

export default Header;