import React, { useContext, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const EditPlanDialog = ({ showDialog, closeDialog, planInfo, getPlans }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [tx, setTx] = useState(100)
    const [fx, setFx] = useState(100)

    const handleEditPlan = async () => {

        const planName = document.getElementById('planName').value
        const description = document.getElementById('description').value
        const planNature = document.getElementById('planNature').value
        const neededLogin = document.getElementById('neededLogin').value
        let fDate = document.getElementById('fDate').value
        let tDate = document.getElementById('tDate').value

        fDate = fDate.split('/')
        tDate = tDate.split('/')

        fDate = fDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(fDate[0])), parseInt(fixNumbers(fDate[1])), parseInt(fixNumbers(fDate[2]))) : null
        tDate = tDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(tDate[0])), parseInt(fixNumbers(tDate[1])), parseInt(fixNumbers(tDate[2]))) : null

        const body = { planName, description, planNature, neededLogin, parentPlanId: planInfo.parentPlanId, icon: '0', fDate, tDate }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.put(`/api/sunyar/plan/plan/${planInfo?.planId}`, body)
            if (status === 200) {
                toastSuccess('عنوان طرح با موفقیت ویرایش گردید!')
                getPlans()
                closeDialog()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

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

                <div className="container d-flex flex-column justify-content-center align-items-center">

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">ویرایش طرح</span></p>

                    <input type="text" id="planName" name="planName" className="bg-input-dialog mt-3 w-100" placeholder="عنوان اصلی" defaultValue={planInfo?.planName} />

                    <div className="mt-3 w-100">
                        <DatePicker
                            value={timestampToPersian(new Date(planInfo?.fDate).getTime())}
                            minDate={planInfo?.parentPlanId ? timestampToPersian(new Date(planInfo?.fDate).getTime()) : null}
                            locale={persian_fa}
                            editable={false}
                            calendar={persian}
                            inputMode='none'
                            inputClass='w-100 bg-input-dialog'
                            containerClassName="w-100 z"
                            placeholder="تاریخ شروع طرح "
                            id="fDate"
                            multiple={false} />
                    </div>

                    <div className="mt-3 w-100">
                        <DatePicker
                            value={timestampToPersian(new Date(planInfo?.tDate).getTime())}
                            maxDate={planInfo?.parentPlanId ? timestampToPersian(new Date(planInfo?.tDate).getTime()) : null }
                            locale={persian_fa}
                            editable={false}
                            calendar={persian}
                            inputMode='none'
                            inputClass='w-100 bg-input-dialog'
                            containerClassName="w-100"
                            placeholder="تاریخ پایان طرح "
                            id="tDate"
                            multiple={false} />
                    </div>

                    <div class="bg-input-dialog d-flex p-0 mt-3 w-100">
                        <span class="border border-radius-0-05rem-05rem-0 p-2"> ماهیت طرح </span>
                        <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" defaultValue={planInfo?.planNature} id="planNature" name="planNature">
                            <option value={true} >نقدی</option>
                            <option value={false}>غیرنقدی</option>
                        </select>
                    </div>

                    <div class="bg-input-dialog d-flex p-0 mt-3 w-100">
                        <span class="border border-radius-0-05rem-05rem-0 p-2"> نیاز به لاگین </span>
                        <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" defaultValue={planInfo?.neededLogin} id="neededLogin" name="neededLogin">
                            <option value={false} >ندارد</option>
                            <option value={true}>دارد</option>
                        </select>
                    </div>

                    <textarea type="text" id="description" name="description" className="bg-input-dialog mt-3 pb-5 w-100" placeholder="توضیحات" defaultValue={planInfo?.description} />

                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleEditPlan}>به‌روزرسانی</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default EditPlanDialog;