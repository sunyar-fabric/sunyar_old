import React, { useContext } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';

const EditCashAssistance = ({ showDialog, closeDialog, getAllSuccorCash, cashAssistanceObj, planInfo }) => {

    const { setLoadingDialog } = useContext(MainContext)

    const handleEditCashAssistance = async () => {

        const neededPrice = document.getElementById('neededPrice').value
        const minPrice = document.getElementById('minPrice').value
        const description = document.getElementById('description1').value
        const body = { assignNeedyPlanId: cashAssistanceObj?.assignNeedyPlanId, planId: planInfo.planId, neededPrice, minPrice, description }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.put(`/api/sunyar/plan/succorCash/${cashAssistanceObj?.cashAssistanceDetailId}`, body)
            if (status === 200) {
                toastSuccess('کمک انتخاب شده با موفقیت ویرایش گردید!')
                getAllSuccorCash()
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

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> ویرایش کمک</span></p>

                    <input readOnly type="text" id="bankId" name="bankId" className="bg-input-dialog mt-3" placeholder={`نام طرح: ${planInfo.planName}`} />
                    <input readOnly type="text" id="bankId" name="bankId" className="bg-input-dialog mt-3" placeholder={`نام نیازمند: ${cashAssistanceObj?.tblAssignNeedyToPlan?.tblPersonal?.name} ${cashAssistanceObj?.tblAssignNeedyToPlan?.tblPersonal?.family}`} />

                    <div className="d-flex bg-input-dialog mt-3 py-0">
                        <input type="text" id="neededPrice" name="neededPrice" className="bg-input-dialog-brial" placeholder="مبلغ مورد نیاز" defaultValue={cashAssistanceObj?.neededPrice} />
                        <span class="bg-input-dialog-rial ml-1">ریال</span>
                    </div>

                    <div className="d-flex bg-input-dialog mt-3 py-0">
                        <input type="text" id="minPrice" name="minPrice" className="bg-input-dialog-brial" placeholder="حداقل مبلغ کمک" defaultValue={cashAssistanceObj?.minPrice} />
                        <span class="bg-input-dialog-rial ml-1">ریال</span>
                    </div>

                    <textarea type="text" id="description1" name="description1" className="bg-input-dialog mt-3 pb-5" placeholder="توضیحات" defaultValue={cashAssistanceObj?.description} />

                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleEditCashAssistance}>به‌روز رسانی</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default EditCashAssistance;