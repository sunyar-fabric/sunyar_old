import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';

const CreateSuccorCashDialog = ({ showDialog, closeDialog, planInfo, getAllSuccorCash }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [needysAssignToThisPlan, setNeedysAssignToThisPlan] = useState([])
    const [assignNeedyPlanId, setAssignNeedyPlanId] = useState('')
    const [description, setDescription] = useState('')

    const getAllNeedysAssignToThisPlan = async () => {

        setLoadingDialog(true)
        try {
            let { status, data } = await HttpService.get(`/api/sunyar/plan/needyToPlan?planId=${planInfo.planId}`)
            if (status === 200) {
                setAssignNeedyPlanId(data[0]?.assignNeedyPlanId);
                setNeedysAssignToThisPlan(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    console.log('assignNeedyPlanId', assignNeedyPlanId);

    const handleSuccorCashToNeedy = async () => {

        const neededPrice = document.getElementById('neededPrice').value
        const minPrice = document.getElementById('minPrice').value

        const body = { assignNeedyPlanId: assignNeedyPlanId ? assignNeedyPlanId : null , planId: planInfo.planId, neededPrice, minPrice, description }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post(`/api/sunyar/plan/succorCash`, body)
            if (status === 200) {
                closeDialog()
                getAllSuccorCash()
                assignNeedyPlanId == null ? toastSuccess('کمک با موفقیت به طرح اضافه گردید!') : toastSuccess('کمک با موفقیت به نیازمند طرح اضافه گردید!')
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        getAllNeedysAssignToThisPlan()
    },[])

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

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> افزودن کمک به نیازمندان طرح <strong className='text-info'>{planInfo.planName}</strong></span></p>

                    <div className="bg-input-dialog d-flex align-items-center p-0 mt-3">
                        <span className="text-center w-25 py-2 bg-info text-white border-radius-0-05rem-05rem-0" id="basic-addon1">نام نیازمند</span>
                        <select className="bg-input-dialog p-0 mx-2" aria-label="Default select example" id="bankId" name="bankId" defaultValue={needysAssignToThisPlan?.assignNeedyPlanId} onChange={(e) => setAssignNeedyPlanId(e.target.value)}>
                            {needysAssignToThisPlan.length > 0 ?
                                needysAssignToThisPlan.map(b =>
                                    <option value={b?.assignNeedyPlanId}>{`${b?.tblPersonal?.name} ${b?.tblPersonal?.family}`}</option>
                                )
                                : null}
                        </select>
                    </div>

                    <div className="d-flex bg-input-dialog mt-3 py-0">
                        <input type="text" id="neededPrice" name="neededPrice" className="bg-input-dialog-brial" placeholder="مبلغ مورد نیاز" />
                        <span class="bg-input-dialog-rial ml-1">ریال</span>
                    </div>

                    <div className="d-flex bg-input-dialog mt-3 py-0">
                        <input type="text" id="minPrice" name="minPrice" className="bg-input-dialog-brial" placeholder="حداقل مبلغ کمک" />
                        <span class="bg-input-dialog-rial ml-1">ریال</span>
                    </div>

                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} type="text" id="description" name="description" className="bg-input-dialog mt-3 pb-5" placeholder="توضیحات" />

                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleSuccorCashToNeedy}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default CreateSuccorCashDialog;