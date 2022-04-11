import React, { useContext, useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import HttpService from '../../service/HttpService';
import img from '../../static/image/img.png';
import { fixNumbers, persianToTimestamp } from '../../util/DateUtil';
import { handleUploadImageThumbnail, readFileDataAsBase64 } from '../../util/FileUtil';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTranslation } from "react-i18next";



const PersonalDialog = ({ showDialog, closeDialog }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [imageBlob, setImageBlob] = useState([])
    const [needyState, setNeedyState] = useState(false)
    const [bd, setFx] = useState(100)
    const [value, setValue] = useState();
    const { t } = useTranslation()




    const handleChangeState = (e) => {
        if (e.target.value !== '2') {
            setNeedyState(false)
        } else setNeedyState(true)
    }

    const handleUploadImageThumbnail = async (e, id) => {
        try {
            if (FileReader && e.target.files[0]) {
                var file = e.target.files[0];
                var fr = new FileReader();
                fr.onload = function () {
                    document.getElementById(id).src = fr.result;
                    setImageBlob(fr.result)
                }
                fr.readAsText(file);

            }
        } catch (error) { }
    };


    function datepickerfunc() {



    }


    const handleCreatePersonal = async () => {

        const name = document.getElementById('name').value
        const family = document.getElementById('family').value
        const idNumber = document.getElementById('idNumber').value
        const nationalCode = document.getElementById('nationalCode').value
        const sex = document.getElementById('sex').value
        const birthDate = document.getElementById('birthDate').value
        const birthPlace = document.getElementById('birthPlace').value
        

        let date = birthDate.split('/')

        const body = { name, family, nationalCode, idNumber, sex, birthDate: persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2]))) == -42563503544000 ? null : persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2]))), birthPlace, personType: '1' }

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.post('/api/cms/um/personal', body)
            if (status === 200) {
                closeDialog()
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
                toastSuccess('شخص حقیقی موردنظر با موفقیت ایجاد گردید!')
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
                maxWidth: '1500px',
                margin: 'auto'
            }}>

                <div className="bg-white m-4 d-flex rounded justify-content-center flex-column align-items-center">
                    <p className="border-bottom w-100 text-start1 pb-3"><span className="m-3">  {t('create_Individuals')}</span></p>

                    <div className="row m-3">

                        <div className="col-6 text-center">
                            <input required type="text" id="name" name="name" className="bg-input-dialog mt-3 w-100 p-2" placeholder={t('name')} />
                        </div>
                        <div className="col-6 text-center">
                            <input required type="text" id="family" name="family" className="bg-input-dialog mt-3 w-100 p-2" placeholder={t('family')} />
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> {t('nature')} </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="personType" name="personType" onChange={e => handleChangeState(e)}>
                                    <option value="1" selected>{t('personal')}</option>
                                    <option value="2" disabled>{t('needy')}</option>
                                    <option value="3" disabled>{t('donorator')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex h-75 align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> {t('gender')} </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="sex" name="sex">
                                    <option value={true}>{t('female')}</option>
                                    <option value={false}>{t('male')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="nationalCode" name="nationalCode" className="bg-input-dialog mt-3 w-100 p-2" placeholder={t('national_code')} />
                        </div>
                        <div className="col-6 text-center">
                            <input required type="text" id="idNumber" name="idNumber" className="bg-input-dialog mt-3 w-100 p-2" placeholder={t('id_number')} />
                        </div>

                        <div className="col-6 text-center">
                            <DatePicker
                                zIndex={bd}
                                onFocusedDateChange={() => setFx(-100)}
                                onOpen={() => setFx(100)}
                                maxDate={new Date().getTime()}
                                locale={persian_fa}
                                calendar={persian}
                                editable={false}
                                inputMode='none'
                                inputClass='w-100 bg-input-dialog mt-3 p-2'
                                containerClassName="w-100"
                                placeholder={t('Date_of_birth')}
                                id="birthDate"
                                multiple={false} />
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="birthPlace" name="birthPlace" className="bg-input-dialog mt-3 w-100 p-2" placeholder={t('birthplace')} />
                        </div>

                        <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                        </div>

                        {needyState ?
                            <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                                <img src={img} id='personalImg' className="p-2 border-radius-09rem" style={{ maxWidth: "50px" }} />
                                <label className="bg-input-dialog text-center cursor-pointer d-flex align-items-center justify-content-center mb-0 p-2" style={{ borderRadius: "0.5rem 0 0 0.5rem" }}>
                                    <input
                                        onChange={(e) => handleUploadImageThumbnail(e, 'personalImg')}
                                        type="file"
                                        title="&nbsp;"
                                        accept="image/png, image/jpeg"
                                        className="form-control-file text-center d-none border-radius-05rem-0-0-05rem cursor-pointer"
                                        id="personalImageThumb"
                                    />
                                    انتخاب‌ عکس
                                    <i className="fa fa-camera mr-1" aria-hidden="true"></i>
                                </label>
                            </div> : null}

                    </div>

                    <div className="d-flex mt-4"><a className="btn btn-info mx-2 px-5" onClick={handleCreatePersonal}>{t('save')}</a><a className="btn btn-outline-info mx-2 text-info px-5" onClick={closeDialog}>{t('cancel')}</a></div>

                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default PersonalDialog;