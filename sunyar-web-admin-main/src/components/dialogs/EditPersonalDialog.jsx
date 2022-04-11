import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import HttpService from '../../service/HttpService';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTranslation } from "react-i18next";


const EditPersonalDialog = ({ showDialog, closeDialog, personId }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [personalInfo, setPersonalInfo] = useState([]);
    const [bd, setFx] = useState(100)
    const { t } = useTranslation()


    const handleEditPersonal = async () => {

        const name = document.getElementById('name').value
        const family = document.getElementById('family').value
        const idNumber = document.getElementById('idNumber').value
        const nationalCode = document.getElementById('nationalCode').value
        const sex = document.getElementById('sex').value
        const birthDate = document.getElementById('birthDate').value
        const birthPlace = document.getElementById('birthPlace').value

        let date = birthDate.split('/')
        const limitDate = persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2])))
        if (limitDate <= new Date().getTime()) {

            const body = { name, family, nationalCode, idNumber, sex, birthDate: birthDate ? limitDate : null, birthPlace, personType: '1' }

            setLoadingDialog(true)
            try {
                const { status, data } = await HttpService.put(`/api/cms/um/personal/${personId}`, body)
                if (status === 200) {
                    closeDialog()
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                    toastSuccess('اطلاعات شخص حقیقی موردنظر با موفقیت ویرایش گردید!')
                }
            } catch (error) { }
            setLoadingDialog(false)


        } else {

            alert('تاریخ وارد شده بزرگتر از حد مجاز است!!')

        }
    }

    const getPersonalById = async (id) => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/cms/um/personal?personId=${id}`)
            if (status === 200) {
                setPersonalInfo(data)

                console.log('PersonalInfo', data);
                document.getElementById('sex').value = data[0]?.sex
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    useEffect(() => {
        getPersonalById(personId)
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">ویرایش شخص حقیقی</span></p>

                    <div className="row m-3">

                        <div className="col-6 text-center">
                            <input required type="text" id="name" name="name" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام " defaultValue={personalInfo[0]?.name} />
                        </div>
                        <div className="col-6 text-center">
                            <input required type="text" id="family" name="family" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام خانوادگی" defaultValue={personalInfo[0]?.family} />
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> ماهیت </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="personType" name="personType">
                                    <option value="1" selected>پرسنل</option>
                                    <option value="2" disabled>نیازمند</option>
                                    <option value="3" disabled>خیّر</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex h-75 align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> جنسیت </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="sex" name="sex" defaultValue={personalInfo[0]?.sex}>
                                    <option value={true}>زن</option>
                                    <option value={false}>مرد</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="nationalCode" name="nationalCode" className="bg-input-dialog mt-3 w-100 p-2" placeholder="کد ملی" defaultValue={personalInfo[0]?.nationalCode} />
                        </div>
                        <div className="col-6 text-center">
                            <input required type="text" id="idNumber" name="idNumber" className="bg-input-dialog mt-3 w-100 p-2" placeholder="شماره شناسنامه" defaultValue={personalInfo[0]?.idNumber} />
                        </div>

                        <div className="col-6 text-center">
                            <DatePicker
                                value={personalInfo[0]?.birthDate ? timestampToPersian(new Date(personalInfo[0]?.birthDate).getTime()) : null}
                                type='text'
                                calendarPosition='bottom-right'
                                locale={persian_fa}
                                calendar={persian}
                                maxDate={new Date().getTime()}
                                inputMode='none'
                                inputClass='w-100 bg-input-dialog mt-3 p-2'
                                containerClassName="w-100"
                                placeholder="تاریخ تولد "
                                id="birthDate"
                                multiple={false} />
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="birthPlace" name="birthPlace" className="bg-input-dialog mt-3 w-100 p-2" placeholder="محل تولد" defaultValue={personalInfo[0]?.birthPlace} />
                        </div>

                        <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                        </div>

                    </div>

                    <div className="d-flex mt-4"><a className="btn btn-info ml-3 px-5" onClick={handleEditPersonal}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>

                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default EditPersonalDialog;