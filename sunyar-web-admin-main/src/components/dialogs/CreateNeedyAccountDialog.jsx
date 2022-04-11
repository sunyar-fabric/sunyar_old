import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';

const CreateNeedyAccountDialog = ({ showDialog, closeDialog, personId, getNeedyAccountInfoById }) => {

    const [bank, setBank] = useState([])
    const { setLoadingDialog } = useContext(MainContext)

    const handleGetBank = async () => {
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/baseInfo/commonBaseBank`)
            if (status === 200) {
                setBank(data);
            }
        } catch (ex) { }
    }

    const handleCreateNeedyAccount = async () => {

        const bankId = document.getElementById('bankId').value
        const shebaNumber = document.getElementById('shebaNumber').value
        const ownerName = document.getElementById('ownerName').value
        const cardNumber = document.getElementById('cardNumber').value
        const accountNumber = document.getElementById('accountNumber').value
        const accountName = document.getElementById('accountName').value

        const body = { needyId: personId, bankId, shebaNumber, ownerName, cardNumber, accountNumber, accountName }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post('/api/sunyar/beneficiary/needyAccounts', body)
            if (status === 200) {
                toastSuccess('حساب نیازمند با موفقیت ایجاد گردید!')
                getNeedyAccountInfoById()
                closeDialog()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        handleGetBank()
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

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> حساب بانکی</span></p>

                    <div className="bg-input-dialog d-flex align-items-center p-0 mt-3">
                        <span className="text-center w-25 py-2 bg-info text-white border-radius-0-05rem-05rem-0" id="basic-addon1"> نام بانک</span>
                        <select className="bg-input-dialog p-0 mx-2" aria-label="Default select example" id="bankId" name="bankId">
                            {bank.length > 0 ?
                                bank.map(b =>
                                    <option value={b.commonBaseDataId} >{b.baseValue}</option>
                                )
                                : null}
                        </select>
                    </div>

                    <input type="text" id="accountNumber" name="accountNumber" className="bg-input-dialog mt-3" placeholder="شماره حساب" />
                    <input type="text" id="accountName" name="accountName" className="bg-input-dialog mt-3" placeholder="  نام حساب" />
                    <input type="text" id="ownerName" name="ownerName" className="bg-input-dialog mt-3" placeholder="  نام صاحب حساب" />
                    <input type="text" id="shebaNumber" name="shebaNumber" className="bg-input-dialog mt-3" placeholder=" شماره شبا" />
                    <input type="text" id="cardNumber" name="cardNumber" className="bg-input-dialog mt-3" placeholder="  شماره کارت" />

                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleCreateNeedyAccount}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default CreateNeedyAccountDialog;