import React, { useContext } from "react";
import { useHistory } from "react-router";
import HttpService from "../../service/HttpService";
import MainContext from "../context/MainContext";
import logo from "../../static/image/logo-header.png"
import { Link } from "react-router-dom";
import TextField from "../common/textField/TextField";

const Login = (url) => {

    const history = useHistory();

    const { setLoadingDialog } = useContext(MainContext)

    const handleLogin = async (e) => {

        e.preventDefault()

        let username = document.getElementById('username').value
        let password = document.getElementById('password').value

        const body = { username, password }

        if (username && password) {
            setLoadingDialog(true)
            try {
                const { status, headers, data } = await HttpService.post('/api/cms/um/user/login', body)
                if (status === 200) {
                    console.log('loginpostdata', data);
                    localStorage.setItem('token', headers['x-auth-token']);
                    localStorage.setItem('refreshtoken', headers['x-auth-refresh-token']);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('donatorId', data.personId);
                    localStorage.setItem('name', data.name);
                    localStorage.setItem('family', data.family);

                    console.log('datadatadatad', data);
                    url=='register' ? history.replace('/') : history.push('/help')
                }
            } catch (ex) { }
            setLoadingDialog(false)
        }
    }

    return (

        <div className="bg-login">

            <div className="container d-flex flex-column justify-content-center vh-100">

                <div className="p-5 login-form mx-auto border bg-register">

                    <div className="d-flex flex-column align-items-center">
                        <img src={logo} />
                        <p className='h4 my-4 text-center text-register'>ورود</p>
                    </div>

                    <form className='d-flex flex-column justify-content-center align-items-center'>

                        <TextField classNameInput='mb-4' placeHolder='نام کاربری' type='text' id='username' name='username' />

                        <TextField classNameInput='' placeHolder='کلمه عبور' type='password' id='password' name='password' />

                        <Link className='pt-1 text-decoration-none text-register align-self-start forgetPass' to='/signup/register'>کلمه عبور خود را فراموش کرده اید؟</Link>

                        <button type='submit' className='btn-blue-sky w-100 text-center mt-5 py-2 px-4' onClick={(e) => handleLogin(e)} >ورود</button>

                        <Link className='pt-2 text-decoration-none text-register' to='/signup/register'>عضویت</Link>

                    </form>

                </div>
            </div>
        </div>

    );
}

export default Login;
