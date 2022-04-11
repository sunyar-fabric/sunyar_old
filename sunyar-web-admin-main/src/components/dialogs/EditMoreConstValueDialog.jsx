import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';

const EditMoreConstValueDialog = ({ showDialog, closeDialog, commonBaseDataId, commonBaseTypeId, getMoreConstValue }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [moreConstValue, setMoreConstValue] = useState({})

    const handleEditMoreConstValue = async () => {

        let baseValue = document.getElementById('baseValue').value
        const body = { baseValue, commonBaseTypeId }

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.put(`/api/admin/baseData/${commonBaseDataId}`, body)
            if (status === 204) {
                toastSuccess('مقدار انتخاب شده با موفقیت ویرایش گردید!')
                getMoreConstValue()
                closeDialog()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    const getMoreConstValuById = async (id) => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/admin/baseData/${id}`)
            if (status === 200) {
                setMoreConstValue(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        getMoreConstValuById(commonBaseDataId)
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
                maxWidth: '600px',
                margin: 'auto'
            }}>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">ویرایش مقدار</span></p>
                    <input required type="text" id="baseValue" name="baseValue" className="bg-input-dialog mt-4" placeholder="تعریف مقدار جدید" defaultValue={moreConstValue.baseValue} />
                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleEditMoreConstValue}>ویرایش</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default EditMoreConstValueDialog;