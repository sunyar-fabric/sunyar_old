import React, { useContext } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import MainContext from '../context/MainContext';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import { useTranslation } from "react-i18next";


const CreateCommonBaseTypeDialog = ({ showDialog, closeDialog, getCommonBaseTypes }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const { t } = useTranslation()


    const handleCreateCommonBaseType = async () => {

        let baseTypeTitle = document.getElementById('idTitle').value 

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.post('/api/sunyar/baseInfo/commonBaseType', { baseTypeTitle })
            if (status === 200) {
                toastSuccess('اطلاعات با موفقیت ذخیره گردید')
                getCommonBaseTypes()
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">{t('constant_Id')} </span></p>
                    <input required type="text" id="idTitle" name="idTitle" className="bg-input-dialog mt-4" placeholder={t('Constant_ID_title')} />
                    <div className="d-flex mt-5"><a className="btn btn-info mx-3 px-5" onClick={handleCreateCommonBaseType}>{t('save')}</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>{t('cancel')}</a></div>
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default CreateCommonBaseTypeDialog;