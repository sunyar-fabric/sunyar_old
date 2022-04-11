import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import HttpService from "../../service/HttpService";
import MainContext from "../context/MainContext";
import logo from "../../static/image/logo-header.png"
import { Link } from "react-router-dom";
import { toastError, toastSuccess } from "../../util/ToastUtil";
import TextField from "../common/textField/TextField";


const Register = () => {

    const history = useHistory();
    const { setLoadingDialog } = useContext(MainContext)

    const handleRegister = async (e) => {

        e.preventDefault()

        let name = document.getElementById('name').value
        let family = document.getElementById('family').value
        let nationalCode = document.getElementById('nationalCode').value
        let sex = document.getElementById('sex').value
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
        let repeatPassword = document.getElementById('repeatPassword').value

        if (password !== repeatPassword) {
            toastError('رمز وارد شده با تکرار آن مطابقت  ندارد')
            return
        }
        if (nationalCode.length < 10) {
            toastError('کدملی وارد شده اشتباه است')
            return
        }

        const body = { name, family, nationalCode, sex, personType: '3', username, password, expireDate: 1949921690000, active: true }

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.post('/api/cms/um/personal/personalAccount', body)
            if (status === 200) {
                toastSuccess('ثبت نام با موفقیت انجام گردید!')
                history.replace('/signup/login/register');
            }
        } catch (ex) { }
        setLoadingDialog(false)
    }

    return (

        <div className="bg-login vh-100 ">

            <div className="d-flex p-4 flex-column justify-content-center align-items-center">
                
                <div className="px-5 py-5 mx-auto border bg-register " >
                    
                    <div className="d-flex flex-column align-items-center mx-5 ">
                        <img src={logo} />
                        <p className='h5 my-1 text-center text-register' pl>عضویت</p>
                    </div>

                    <form className='d-flex flex-column justify-content-center align-items-center px-3' onSubmit={(e) => handleRegister(e)}>

                        <TextField classNameInput='mb-3' placeHolder='نام' type='text' id='name' name='name' />
                        <TextField classNameInput='mb-3' placeHolder='نام‌خانوادگی' type='text' id='family' name='family' />
                        <div className="mb-3 w-100" style={{ borderBottom: "1px solid #ccc" }}>
                            <select className="w-100 border-0 outline-none" id="sex" name="sex">
                                <option value="false" selected>جنسیت</option>
                                <option value="false" >مرد</option>
                                <option value="true" >زن</option>
                            </select>
                        </div>
                        <TextField classNameInput='mb-3' placeHolder='کدملی' length={10} type='text' id='nationalCode' name='nationalCode' />
                        <TextField classNameInput='mb-3' placeHolder='نام کاربری' type='text' id='username' name='username' />
                        <TextField classNameInput='mb-3' placeHolder='کلمه عبور' type='password' id='password' name='password' />
                        <TextField classNameInput='mb-3' placeHolder='تکرار کلمه عبور' type='password' id='repeatPassword' name='repeatPassword' />

                        <button type='submit' className='btn-blue-sky w-100 text-center mt-3 py-2 px-4' onClick={(e) => handleRegister(e)} >ثبت‌نام</button>

                        <Link className='pt-2 text-decoration-none text-register' to='/signup/login/register'>ورود</Link>

                    </form>

                </div>
                
            </div>
        </div>

    );
}

export default Register;
