import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { useTranslation } from "react-i18next";


const EditCommonBaseTypeDialog = ({ showDialog, closeDialog, commonBaseTypeId, getCommonBaseTypes }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [commonBaseType, setCommonBaseType] = useState([])
    const { t } = useTranslation()


    const getCommonBaseTypeById = async () => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/baseInfo/commonBaseType?commonBaseTypeId=${commonBaseTypeId}`)
            if (status === 200) {
                setCommonBaseType(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleUpdateCommonBaseType = async () => {

        let baseTypeTitle = document.getElementById('idTitle').value

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.put(`/api/sunyar/baseInfo/commonBaseType/${commonBaseTypeId}`, { baseTypeTitle })
            if (status === 200) {
                toastSuccess('شناسه انتخاب شده با موفقیت به‌روز رسانی گردید!')
                getCommonBaseTypes()
                closeDialog()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        getCommonBaseTypeById(commonBaseTypeId)
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> {t('Edit_constant_ID')} </span></p>
                    <input required type="text" id="idTitle" name="idTitle" className="bg-input-dialog mt-4" placeholder={t('Constant_ID_title')} defaultValue={commonBaseType[0]?.baseTypeTitle} />
                    <div className="d-flex mt-5"><a className="btn btn-info mx-2 px-5" onClick={handleUpdateCommonBaseType}>{t('edit')} </a><a className="btn mx-2 btn-outline-info text-info px-5" onClick={closeDialog}>{t('cancel')}</a></div>
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default EditCommonBaseTypeDialog;