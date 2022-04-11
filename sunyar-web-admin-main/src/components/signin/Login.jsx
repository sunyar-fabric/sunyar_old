import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import HttpService from "../../service/HttpService";
import MainContext from "../context/MainContext";
import logo from "../../static/image/logo-header1.png"
import { Link } from "react-router-dom";
import TextField from "../common/textField/TextField";
import ResetPasswordDialog from "../dialogs/ResetPasswordDialog";

const Login = () => {
    const history = useHistory();
    const [resetPassword, setResetPassword] = useState(false)
    const { setLoadingDialog } = useContext(MainContext)
    let { profile, setProfile } = useContext(MainContext)
    const handleLogin = async (e) => {
        e.preventDefault()
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
        if (username && password) {
            setLoadingDialog(true)
            try {
                const { status, headers, data } = await HttpService.post('/api/cms/um/user/login', { username, password })
                if (status === 200) history.replace('/');
                localStorage.setItem('token', headers['x-auth-token']);
                localStorage.setItem('refreshtoken', headers['x-auth-refresh-token']);
                localStorage.setItem('username', data.username);
                localStorage.setItem('name', data.name)
                localStorage.setItem('family', data.family)
                setProfile(data.roles)

                for (let i = 0; i < data.roles.length; i++) {
                    localStorage.setItem(`role${i}`, JSON.stringify(data.roles[i]))
                }
                history.push('/')
            } catch (ex) { }
            setLoadingDialog(false)
        }
    }

    function handleReset() {
        setResetPassword(true)
    }

    return (
        <>
            {resetPassword ?
                <ResetPasswordDialog
                    showDialog={resetPassword}
                    closeDialog={() => setResetPassword(false)}
                /> : null}

            <div className="bg-login">
                <div className="container d-flex flex-column justify-content-center vh-100">
                    <div className="px-5 pt-5 pb-4 login-form mx-auto border bg-register rounded">
                        <div className="d-flex flex-column align-items-center">
                            <img src={logo} className="" />
                            <p className='h4 pt-4 text-center text-register '></p>
                        </div>
                        <form className='d-flex flex-column justify-content-center align-items-center'>

                            <TextField classNameInput='mb-4' placeHolder='نام کاربری / username' type='text' id='username' name='username' />

                            <TextField classNameInput='mb-4' placeHolder='کلمه عبور / password' type='password' id='password' name='password' />

                            <button type='submit' className='btn-blue-sky w-100 text-center mt-2 mb-4 py-2 px-4' onClick={(e) => handleLogin(e)} >ورود / Login</button>

                            <p className='pt-2 mb-0  w-100 text-decoration-none text-center text-register align-self-start forgetPass cursor-pointer ' onClick={handleReset} >کلمه عبور خود را فراموش کرده اید؟</p>
                            <p className='pt-0 mt-1 w-100 text-decoration-none text-center text-register align-self-start forgetPass cursor-pointer ' onClick={handleReset} >?Forgot Your Password </p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
