import React from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../../static/image/logo-header.png';
import phone from '../../static/image/12.gif';
import Email from '../../static/image/11.gif';


const Header = () => {
    const history = useHistory()

    return (
        <header className='container header-theme py-3'>
            <div className='d-flex justify-content-center flex-wrap'>
                <div className=" d-flex col-12 col-md-4">
                    <div className=' d-flex mx-auto align-items-center '>
                        <div className="p-0 ml-0 mt-1">
                            <img src={phone} style={{ maxWidth: "50px" }} />
                        </div>
                        <div className="mr-1">
                            <p className="logo-text mb-0  mt-3 text-right text-dark">تلفن تماس</p>
                            <p className="logo-text mt-0 num-color ">98215265843+</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex col-12 col-md-4 ">
                    <div className="mx-auto p-0">
                        <img className="" src={logo} alt="لوگوی سانیار" style={{ maxWidth: "200px" }} />
                    </div>
                </div>
                <div className=" d-flex col-12 col-md-4">
                    <div className=' d-flex mx-auto align-items-center '>
                        <div className="mr-1">
                            <p className="logo-text mb-0 mt-3 mx-1 text-dark">EMAIL</p>
                            <p className="logo-text mt-0 mx-1 num-color">polwinno@gmail.com</p>
                        </div>
                        <div className="p-0 ml-3 mt-1">
                            <img src={Email} style={{ maxWidth: "50px" }} />
                        </div>
                    </div>
                </div>
            </div>

        </header>);
}

export default Header;