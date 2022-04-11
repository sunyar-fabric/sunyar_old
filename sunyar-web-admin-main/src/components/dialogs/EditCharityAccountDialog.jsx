import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { useTranslation } from "react-i18next";


const EditCharityAccountDialog = ({ showDialog, closeDialog, charityAccount, getCharityAccounts }) => {

    const [bank, setBank] = useState([])
    const { setLoadingDialog } = useContext(MainContext)
    const { t } = useTranslation()


    const handleGetBank = async () => {
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/baseInfo/commonBaseBank`)
            if (status === 200) {
                setBank(data);
            }
        } catch (ex) { }
        document.getElementById('bankId').value = charityAccount.bankId
    }

    const handleUpdateCharityAccount = async () => {

        const bankId = document.getElementById('bankId').value
        const branchName = document.getElementById('branchName').value
        const ownerName = document.getElementById('ownerName').value
        const cardNumber = document.getElementById('cardNumber').value
        const accountNumber = document.getElementById('accountNumber').value
        const accountName = document.getElementById('accountName').value
        
        const body = { bankId, branchName, ownerName, cardNumber, accountNumber, accountName }

        setLoadingDialog(true)
        try {
            const { status } = await HttpService.put(`/api/sunyar/baseInfo/charityAccounts/${charityAccount.charityAccountId}`, body)
            if (status === 200) {
                toastSuccess('حساب انتخاب شده با موفقیت به‌روز رسانی گردید!')
                getCharityAccounts()
                closeDialog()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        handleGetBank();
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> {t('Edit_Charity_Account')} </span></p>

                    <div className="bg-input-dialog d-flex align-items-center p-0">
                        <span className="text-center w-25 py-2 bg-info text-white border-radius-0-05rem-05rem-0" id="basic-addon1"> {t('Bank_Name')} </span>
                        <select className="bg-input-dialog p-0 mx-2" aria-label="Default select example" id="bankId" name="bankId" defaultChecked={charityAccount.bankId}>
                            {bank.length > 0 ?
                                bank.map(b =>
                                    <option value={b.commonBaseDataId} key={b.commonBaseDataId} >{b.baseValue}</option>
                                )
                                : null}
                        </select>
                    </div>

                    <input type="text" id="branchName" name="branchName" className="bg-input-dialog mt-3" placeholder={t('Branch_Name')} defaultValue={charityAccount.branchName} />
                    <input type="text" id="ownerName" name="ownerName" className="bg-input-dialog mt-3" placeholder={t('account_owner')} defaultValue={charityAccount.ownerName} />
                    <input type="text" id="cardNumber" name="cardNumber" className="bg-input-dialog mt-3" placeholder={t('Card_Number')} defaultValue={charityAccount.cardNumber} />
                    <input type="text" id="accountNumber" name="accountNumber" className="bg-input-dialog mt-3" placeholder={t('Account_Number')} defaultValue={charityAccount.accountNumber} />
                    <input type="text" id="accountName" name="accountName" className="bg-input-dialog mt-3" placeholder={t('Account_Name')} defaultValue={charityAccount.accountName} />
                    <div className="d-flex mt-5"><a className="btn btn-info mx-2 px-5" onClick={handleUpdateCharityAccount}> {t('save')} </a><a className="btn btn-outline-info mx-2 text-info px-5" onClick={closeDialog}> {t('cancel')}</a></div>
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default EditCharityAccountDialog;