import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import HttpService from '../../service/HttpService';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import { toastError, toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const CreateUserDialog = ({ showDialog, closeDialog, getAllUsers }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [user, setUser] = useState([]);
    const [personals, setPersonals] = useState([])
    const [personId, setPersonId] = useState()
    const [userId, setUserId] = useState('')
    const [bd, setFx] = useState(100)


    const getAllPersonals = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get('/api/cms/um/personal/personal1')
            if (status === 200) {
                setPersonals(data)
                setPersonId(data.personId)

            }
        } catch (error) { }
        setLoadingDialog(false)
    }


    function getPerson(e) {
        setUserId(e.target.value)
    }

    const handleCreateUser = async () => {

        let date = document.getElementById('expireDate').value.split('/')
        const expireDate = persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2])))
        const realdate = new Date().getTime() - expireDate
        const active = realdate <= 0 ? document.getElementById('active').value : false
        const username = document.getElementById('usernameC').value
        const password = document.getElementById('passwordC').value
        const rePassword = document.getElementById('repasswordC').value


        if (password !== rePassword) {
            toastError("تکرار رمز عبور با رمزعبور مطابقت ندارد")
            return
        }

        const body = { personId: userId, expireDate, active, username, password }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post('/api/cms/um/user', body)
            if (status === 200) {
                toastSuccess('کاربر با موفقیت ایجاد گردید!')
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

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> ایجاد کاربر </span></p>

                    <div className="row m-3">

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> شخص </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="select" name="" onChange={(e) => getPerson(e)} >
                                    <option value='' > انتخاب </option>
                                    {personals.filter((personals) => personals?.personType === "1").map((p, index) => (
                                        <option value={p.personId.personId} >{p.name} {p.family}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="usernameC" name="usernameC" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام کاربری" />
                        </div>

                        <div className="col-6 text-center">
                            <input required type="password" id="passwordC" name="passwordC" className="bg-input-dialog mt-3 w-100 p-2" placeholder="رمز عبور " />
                        </div>

                        <div className="col-6 text-center">
                            <input required type="password" id="repasswordC" name="repasswordC" className="bg-input-dialog mt-3 w-100 p-2" placeholder=" تکرار رمز عبور " />
                        </div>

                        <div className="col-6 text-center">
                            <DatePicker
                                type='text'
                                locale={persian_fa}
                                calendar={persian}
                                inputMode='none'
                                inputClass='w-100 bg-input-dialog mt-3 p-2'
                                containerClassName="w-100"
                                placeholder="تاریخ انقضا "
                                id="expireDate"
                                multiple={false} />
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> وضعیت </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="active" name="active">
                                    <option value="false" >غیر فعال</option>
                                    <option value="true" >فعال</option>

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

export default CreateUserDialog;