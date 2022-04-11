import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import MainContext from '../context/MainContext';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';

const ConstValuesDialog = ({ showDialog, closeDialog }) => {

    const { setLoadingDialog } = useContext(MainContext)

    const handleCreateConstValue = async () => {

        let baseTypeCode = document.getElementById('idCode').value
        let baseTypeTitle = document.getElementById('idTitle').value

        const body = { baseTypeCode, baseTypeTitle }

        try {
            let { status } = await HttpService.post('/api/admin/baseType', body)
            if (status === 204) {
                closeDialog()
                toastSuccess('اطلاعات با موفقیت ذخیره گردید')
            }
        } catch (error) { }
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">شناسه ثابت</span></p>
                    <input type="text" id="idCode" name="idCode" className="bg-input-dialog mt-4" placeholder="کد شناسه ثابت" />
                    <input type="text" id="idTitle" name="idTitle" className="bg-input-dialog mt-4" placeholder="عنوان شناسه ثابت" />
                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleCreateConstValue}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default ConstValuesDialog;