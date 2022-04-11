import React, { useContext, useState } from 'react';
import HttpService from '../../service/HttpService';
import { toastError, toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import DatePickerHeader from 'react-multi-date-picker/plugins/date_picker_header';


const ResetPasswordDialog = ({ showDialog, closeDialog }) => {

    const [user, setUser] = useState('')
    const [username, setUsername] = useState('')
    const [nationalCode, setNationalCode] = useState('')
    const { setLoadingDialog } = useContext(MainContext)

    const getUser = async () => {
        setLoadingDialog(true)
        try {
            const { headers, status, data } = await HttpService.get(`/api/cms/um/user?username=${document.getElementById('uniqueUsername').value}`)
            if (status === 200) {

                if (data.username === document.getElementById('uniqueUsername').value && data.tblPersonal.nationalCode === document.getElementById('uniqueNationalCode').value) {
                   
                    setUser(data)

                    const expireDate = data.expireDate
                    const active = data.active
                    const username = data.username
                    const password = document.getElementById('resetpassword').value
                    const rePassword = document.getElementById('resetrepassword').value

                    if (password !== rePassword) {
                        toastError("Repeat password does not match password/تکرار رمز عبور با رمزعبور مطابقت ندارد")
                        return
                    }

                    const body = { personId: data.personId, expireDate, active, username, password }

                    let updatePassReq = await HttpService.put(`/api/cms/um/user/${data.userId}`, body)
                    if (updatePassReq.status === 200) {
                        toastSuccess('رمز با موفقیت ویرایش گردید!')
                        closeDialog()
                    }

                }
            }
        } catch (error) { }
        setLoadingDialog(false)
    }



    return (
        <DialogOverlay
            isOpen={showDialog}
            onDismiss={closeDialog}
            className="d-flex justify-content-center align-items-center"
            style={{ background: 'rgb(53 53 53 / 62%)' }}
        >
            <DialogContent style={{
                borderRadius: '10px',
                boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)',
                height: 'unset',
                maxWidth: '600px',
                margin: 'auto'
            }}>

                <div className="bg-white mx-4   d-flex rounded justify-content-center flex-column align-items-center">
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">  تغییر رمز عبور / change password </span></p>
                    <div className="bg-white w-100 mx-4 mb-4 mt-2 d-flex rounded justify-content-center flex-column align-items-center">
                        <div className=" flex-column w-100 m-1 mt-1">
                            <div className="col-12 text-center">
                                <input required type="text" id="uniqueUsername" name="persianName" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام کاربری / username " />
                            </div>
                            <div className="col-12 text-center">
                                <input required type="text" id="uniqueNationalCode" name="latinName" className="bg-input-dialog mt-3 w-100 p-2" placeholder="کد ملی / national code " />
                            </div>
                            <div className="col-12 text-center">
                                <input required type="password" id="resetpassword" name="password" className="bg-input-dialog mt-3 w-100 p-2" placeholder=" رمز عبور جدید / new password " />
                            </div>
                            <div className="col-12 text-center">
                                <input required type="password" id="resetrepassword" name="repassword" className="bg-input-dialog mt-3 w-100 p-2" placeholder="تکرار رمز عبور جدید / repeat new password " />
                            </div>
                            <div className="d-flex justify-content-center mt-5"><button className="btn btn-info ml-3 px-5" onClick={getUser} >ذخیره / save</button><button className="btn btn-outline-info text-info hoverBttn px-5" onClick={closeDialog}>انصراف / cancel </button></div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default ResetPasswordDialog;