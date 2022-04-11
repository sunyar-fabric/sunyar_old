import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';



const MainNav = () => {

    const history = useHistory()

    function handleClose() {
        localStorage.clear()
        history.push('/signup/login/register')
    }

    return (
        <div className='d-flex justify-content-center align-items-center p-0 mt-2 main-nav' style={{ borderBottom: "1px solid ", borderBottomColor: "rgb(55, 174, 204)", zIndex: '1000', top: '0' }}>
            <nav className="navbar navbar-expand-lg navbar-dark w-100 p-0 " >
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon text-white"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo03">

                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <NavLink className="nav-link text-white py-3 px-4" activeClassName="active-nav" to="/signup/register">{localStorage.getItem('name')} {localStorage.getItem('family')}</NavLink>
                    </ul>

                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <NavLink className="nav-link text-white py-3 px-4 mr-5 active-nav" activeClassName="active-nav" aria-current="page" to="/">صفحه اصلی</NavLink>
                        <NavLink className="nav-link text-white py-3 px-4 active-nav" activeClassName="active-nav" to="/help">می‌خواهم کمک کنم</NavLink>
                        <NavLink className="nav-link text-white py-3 px-4 active-nav" activeClassName="active-nav" to="/signup/register">عضویت</NavLink>
                        <NavLink className="nav-link text-white py-3 px-4 active-nav" activeClassName="active-nav" to="/#news">اخبار</NavLink>
                        <NavLink className="nav-link text-white py-3 px-4 active-nav" activeClassName="active-nav" to="/#contactUs">تماس با ما</NavLink>
                        <NavLink className="nav-link text-white py-3 px-4 active-nav" activeClassName="active-nav" to="/#aboutUs">درباره ما</NavLink>
                        <NavLink className="nav-link text-white py-3 px-4 ml-5 active-nav" activeClassName="active-nav" to="/#plans">طرح‌ها</NavLink>
                    </ul>

                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        {localStorage.getItem('token') ?
                            <NavLink className="nav-link text-white py-3 px-4" activeClassName="active-nav" onClick={handleClose} to="/signup/login/register">خروج</NavLink>
                            :
                            <NavLink className="nav-link text-white py-3 px-4" activeClassName="active-nav" to="/signup/login/register">ورود</NavLink>
                        }
                    </ul>

                </div>
            </nav>
        </div>);
}

export default MainNav;
