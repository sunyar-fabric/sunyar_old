import React, { useContext } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import MainContext from '../context/MainContext';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';

const DeleteCashAssistance = ({ showDialog, closeDialog, cashAssistanceDetailId, getAllSuccorCash }) => {

    const { setLoadingDialog } = useContext(MainContext)

    const handleDeleteCashAssistance = async () => {

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.delete(`/api/sunyar/plan/succorCash/${cashAssistanceDetailId}`)
            if (status === 204) {
                toastSuccess('کمک انتخاب شده با موفقیت حذف گردید!')
                closeDialog()
                getAllSuccorCash()
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
                    <p className="w-100 text-center p-3"><span className="m-3">آیا از حذف کمک انتخاب شده اطمینان دارید؟</span></p>
                    <div className="d-flex mt-3"><a className="btn btn-outline-success text-success ml-3 px-5" onClick={handleDeleteCashAssistance}>بلی</a><a className="btn btn-outline-danger text-danger px-5" onClick={closeDialog}>خیر</a></div>
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default DeleteCashAssistance;