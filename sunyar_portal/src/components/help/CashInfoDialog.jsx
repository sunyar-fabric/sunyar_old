import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from "../../service/HttpService";
import MainContext from '../context/MainContext';
import SuccessPeymentDialog from '../dialogs/SuccessPeymentDialog';
import PeymentGatewayDialog from '../dialogs/PeymentGatewayDialog';
import { timestampToPersian } from '../../util/DateUtil';
import {convertPersianToEnglish} from '../../util/StringUtil'

const CashInfoDialog = ({ showDialog, closeDialog, cashAssistance, planName, setCashInfoDialog }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [successPeymentDialog, setSuccessPeymentDialog] = useState(false);
    const [peymentGatewayDialog, setPeymentGatewayDialog] = useState(false);
    const [payPrice, setPayprice] = useState('');

    const nowDate = new Date();

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      }

    const handlePayment = async () => {

        setLoadingDialog(true)
        try {
            const paymentPrice = convertPersianToEnglish( document.getElementById('paymentPrice').value)

            if (parseInt(paymentPrice) >= parseInt(cashAssistance.minPrice)) {

                const body = { donatorId: localStorage.getItem('donatorId') ? localStorage.getItem('donatorId') : null, cashAssistanceDetailId: cashAssistance?.cashAssistanceDetailId, paymentPrice, paymentGatewayId: '1234567891', paymentDate: new Date().getTime(), paymentTime: "13:00", paymentStatus: 'success', sourceAccoutNumber: getRandomInt(1000000000,9999999999), targetAccountNumber: null , followCode: "1234567891", needyId: cashAssistance?.tblAssignNeedyToPlan ? cashAssistance?.tblAssignNeedyToPlan?.tblPersonal?.personId : null , charityAccountId: null }

                let { data, status } = await HttpService.post(`/api/sunyar/operation/payment`, body);
                if (status === 200) {
                    setPayprice(data.payPrice);
                    setSuccessPeymentDialog(true)
                    setPeymentGatewayDialog(false)
                }
            }
            else {
                document.getElementById('paymentPricealert').style.display = 'block'
            }
        } catch (ex) { }
        setLoadingDialog(false)
    }


    return (
        <DialogOverlay
            isOpen={showDialog}
            onDismiss={closeDialog}
            className="text-center pt-5"
            style={{ background: 'hsla(100%, 100%, 100% , 0.8)' }}
        >
            <DialogContent
                style={{
                    borderRadius: '10px',
                    boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)',
                    height: 'unset',
                    maxWidth: '2000px',
                    margin: 'auto'
                }}
            >
                {successPeymentDialog ?
                    <SuccessPeymentDialog
                        showDialog={successPeymentDialog}
                        closeDialog={() => setSuccessPeymentDialog(false)}
                        payPrice={payPrice}
                        planName={planName}
                    /> : null}


                {peymentGatewayDialog ?
                    <PeymentGatewayDialog
                        showDialog={peymentGatewayDialog}
                        closeDialog={() => setPeymentGatewayDialog(false)}
                        payPrice={payPrice}
                        planName={planName}
                    /> : null}


                <div className="container row">
                    <div className="col-md-12">
                        <div className=" d-flex flex-column justify-content-center align-items-center mb-4">
                            <p className="border-bottom w-100 text-right pb-3 pr-0"><span className="m-1 h6">اطلاعات پرداخت</span></p>
                            {cashAssistance.length !== 0 ? <>
                                <div className="d-flex w-100 bg-input-dialog  mt-3">
                                    <p className="text-right mx-1 mb-0"><span className=""> شماره تراکنش :</span></p>
                                    <p className="text-right mb-0 mr-2">{Math.floor(Math.random() * 99999)}</p>
                                </div>
                                <div className="d-flex w-100 bg-input-dialog mt-3">
                                    <p className="text-right mb-0"><span className="mx-1"> تاریخ پرداخت:</span></p>
                                    <p className="text-right mb-0 mr-2">{timestampToPersian(new Date().getTime())}</p>
                                </div>
                                <div className="d-flex w-100 bg-input-dialog mt-3 mb-3">
                                    <p className="text-right mb-0"><span className="mx-1"> زمان پرداخت:</span></p>
                                    <p className="text-right mb-0 mr-2">{nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds()}</p>
                                </div>

                                <>
                                    <div className='d-flex justify-content-start w-100'>
                                        <p htmlFor="" className='text-danger mb-0 mt-0 mx-2 paymentPricealert  ' id='paymentPricealert' style={{ display: 'none', fontSize: '12px' }} > مبلغ وارد شده از حداقل مبلغ مجاز برای این طرح کمتر است !!! </p>
                                    </div>
                                    <div className=" d-flex w-100 justify-content-center align-items-center">
                                        <input type="text" id="paymentPrice" name="paymentPrice" className="bg-input-dialog-brial " placeholder="مبلغ پرداخت" />
                                        <span className="bg-input-dialog-rial ">ریال</span>
                                    </div>
                                </>

                                {cashAssistance?.tblAssignNeedyToPlan ?

                                    <div className="d-flex w-100 bg-input-dialog mt-3">
                                        <p className="text-right mb-0"><span className="mx-1">بابت کمک به:</span></p>
                                        {` جنسیت (${cashAssistance?.tblAssignNeedyToPlan?.tblPersonal?.sex ? 'زن' : 'مرد'}) - تاریخ تولد (${cashAssistance?.tblAssignNeedyToPlan?.tblPersonal?.birthDate ? timestampToPersian(new Date(cashAssistance?.tblAssignNeedyToPlan?.tblPersonal?.birthDate).getTime()) : null}) `}
                                    </div>
                                    : null}

                            </> : <p>کمکی برای نیازمند انتخاب شده تعریف نگردیده است!</p>}
                        </div>

                        {cashAssistance.length !== 0 ?
                            <div>
                                <button className=' mybtn_dialog_cash px-5 py-1 mr-1' onClick={handlePayment}>پرداخت</button>
                                <button className='mybtn_dialog px-5 py-1 mr-1' onClick={closeDialog}>انصراف</button>
                            </div> : null}
                    </div>
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default CashInfoDialog;