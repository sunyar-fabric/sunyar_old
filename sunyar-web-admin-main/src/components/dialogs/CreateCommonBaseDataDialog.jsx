import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { useTranslation } from "react-i18next";


const CreateCommonBaseDataDialog = ({ showDialog, closeDialog, commonBaseTypeId, getCommonBaseData }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const { t } = useTranslation()


    const handleCreateCommonBaseData = async () => {

        let baseValue = document.getElementById('baseValue').value

        const body = { baseValue, commonBaseTypeId }

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.post('/api/sunyar/baseInfo/commonBaseData', body)
            if (status === 200) {
                toastSuccess('مقدار جدید با موفقیت به شناسه ثابت اضافه گردید!')
                getCommonBaseData()
                closeDialog()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    return (
        <>
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">{t('Add_values_to_the_created_ID')}</span></p>
                    <input required type="text" id="baseValue" name="baseValue" className="bg-input-dialog mt-4" placeholder={t('Define_new_value')}  />
                    <div className="d-flex mt-5"><a className="btn btn-info mx-1 px-5" onClick={handleCreateCommonBaseData}>{t('Add')}</a><a className="btn mx-2 btn-outline-info text-info px-5" onClick={closeDialog}>{t('cancel')}</a></div>
                </div>

                </DialogContent>
            </DialogOverlay>
        </>
    );
}

export default CreateCommonBaseDataDialog;