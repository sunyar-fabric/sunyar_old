import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';

const EditSubPlanDialog = ({ showDialog, closeDialog, planId }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [subPlanInfo, setSubPlanInfo] = useState([]);

    const getSubPlanById = async (id) => {
        setLoadingDialog(true)
        try {
            let { status, data } = await HttpService.get(`/api/admin/plan?planId=${id}`)
            if (status === 200) {
                setSubPlanInfo(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleEditSubPlan = async () => {

        const planName = document.getElementById('subPlanName').value

        const body = { planName, neededLogin: false, planNature: true }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.put(`/api/admin/plan/${planId}`, body)
            if (status === 204) {
                setTimeout(() => {
                    window.location.reload()
                }, 2100)
                closeDialog()
                toastSuccess('عنوان زیرشاخه با موفقیت ویرایش گردید!')
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        getSubPlanById(planId)
    }, []);

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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> ویرایش عنوان زیرشاخه</span></p>
                    <input type="text" id="subPlanName" name="subPlanName" className="bg-input-dialog mt-3" placeholder="عنوان " defaultValue={subPlanInfo[0]?.planName}/>
                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleEditSubPlan}>به‌روز رسانی</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default EditSubPlanDialog;