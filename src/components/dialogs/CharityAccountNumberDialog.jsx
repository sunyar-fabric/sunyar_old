import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';


const CharityAccountNumberDialog = ({ showDialog, closeDialog }) => {

    const handleCreateCharityAccountNumber = async () => {

        const bankId = document.getElementById('bankId').value
        const branchName = document.getElementById('branchName').value
        const ownerName = document.getElementById('ownerName').value
        const cardNumber = document.getElementById('cardNumber').value
        const accountNumber = document.getElementById('accountNumber').value
        const accountName = document.getElementById('accountName').value

        const body = { bankId, branchName, ownerName, cardNumber, accountNumber, accountName }

        try {
            let { status } = await HttpService.post('/api/admin/charityAccount', body)
            if (status === 200) {
                closeDialog()
                toastSuccess('اطلاعات حساب با موفقیت ذخیره گردید')
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
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> حساب های خیریه</span></p>
                    <input type="text" id="bankId" name="bankId" className="bg-input-dialog mt-3" placeholder="  نام بانک" />
                    <input type="text" id="branchName" name="branchName" className="bg-input-dialog mt-3" placeholder="  نام شعبه افتتاح حساب" />
                    <input type="text" id="ownerName" name="ownerName" className="bg-input-dialog mt-3" placeholder="  نام صاحب حساب" />
                    <input type="text" id="cardNumber" name="cardNumber" className="bg-input-dialog mt-3" placeholder="  شماره کارت" />
                    <input type="text" id="accountNumber" name="accountNumber" className="bg-input-dialog mt-3" placeholder="  شماره حساب" />
                    <input type="text" id="accountName" name="accountName" className="bg-input-dialog mt-3" placeholder="  نام حساب" />
                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleCreateCharityAccountNumber}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default CharityAccountNumberDialog;