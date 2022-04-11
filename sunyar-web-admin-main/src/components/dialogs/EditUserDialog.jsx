import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import HttpService from '../../service/HttpService';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import { toastError, toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const EditUserDialog = ({ showDialog, closeDialog, user ,getAllUsers }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [personal, setPersonal] = useState([])
    const [personId, setPersonId] = useState('')
    const [bd, setFx] = useState(100)

    console.log('user',user);

    const getAllPersonals = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get('/api/cms/um/personal/personal1')
            if (status === 200) {
                setPersonal(data)
                document.getElementById('originalSelectBox').value = user?.tblPersonal?.personId
                setPersonId(user.tblPersonal.personId)
                console.log('personal', data);
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    function getPerson(e) {
        setPersonId(e.target.value)
    }

    const handleCreateUser = async () => {

        let date = document.getElementById('expireDateE').value.split('/')
        const expireDate =  persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2])))
        const realdate = new Date().getTime() - expireDate
        const active = realdate <= 0 ? document.getElementById('activeE').value : false
        const username = document.getElementById('usernameE').value
        const password = document.getElementById('passwordE').value ? document.getElementById('passwordE').value : ''
        const rePassword = document.getElementById('repasswordE').value

        if (password !== rePassword) {
            toastError("تکرار رمز عبور با رمزعبور مطابقت ندارد")
            return
        }

        const body = { personId , expireDate, active, username, password }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.put(`/api/cms/um/user/${user.userId}`, body)
            if (status === 200) {
                toastSuccess('کاربر با موفقیت ویرایش گردید!')
                closeDialog()
                getAllUsers()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        getAllPersonals()

    }, [])

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
                maxWidth: '1500px',
                margin: 'auto'
            }}>

                <div className="bg-white m-4 d-flex rounded justify-content-center flex-column align-items-center">

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> ویرایش کاربر </span></p>

                    <div className="row m-3">

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> شخص </span>
                                
                                {user.tblPersonal.personType === "1" ?

                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="originalSelectBox" defaultValue={user?.tblPersonal?.personId} onChange={(e) => getPerson(e)} >
                                    {personal.filter((personal) => personal?.personType === "1").map((p, index) => (
                                        <option value={p.personId.personId} >{p.name} {p.family}</option>
                                    ))}
                                </select>

                                : 

                                <p class="flex-grow-1 select-box cursor-pointer p-0 my-0 mx-2 text-right" aria-label="Default select example" id="originalSelectBox" onChange={(e) => getPerson(e)} >
                                         {user?.tblPersonal.name} {user?.tblPersonal.family}
                                </p>
                                }

                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="usernameE" name="username" className="bg-input-dialog mt-3 w-100 p-2" defaultValue={user?.username} placeholder="نام کاربری" />
                        </div>


                        <div className="col-6 text-center">
                            <input required type="password" id="passwordE" name="password" className="bg-input-dialog mt-3 w-100 p-2" placeholder=" ••••••••• " />
                        </div>

                        <div className="col-6 text-center">
                            <input required type="password" id="repasswordE" name="repassword" className="bg-input-dialog mt-3 w-100 p-2" placeholder=" ••••••••• " />
                        </div>


                        <div className="col-6 text-center">
                            <DatePicker
                                value={user?.date}
                                zIndex={bd}
                                onFocusedDateChange={() => setFx(-100)}
                                onOpen={() => setFx(100)}
                                type='text'
                                locale={persian_fa}
                                calendar={persian}
                                inputMode='none'
                                inputClass='w-100 bg-input-dialog mt-3 p-2'
                                containerClassName="w-100"
                                placeholder="تاریخ انقضا "
                                id="expireDateE"
                                multiple={false} />
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> وضعیت </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" defaultValue={ user?.active === 'غیر فعال' ? "false" : 'true'} id="activeE" name="active1">
                                    <option value="true" >فعال</option>
                                    <option value="false" >غیر فعال</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                        </div>

                    </div>

                    <div className="d-flex mt-4"><a className="btn btn-info ml-3 px-5" onClick={handleCreateUser}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>

                </div>

            </DialogContent>
        </DialogOverlay >);
}

export default EditUserDialog;