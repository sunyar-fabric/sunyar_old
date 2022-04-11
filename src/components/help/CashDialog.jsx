import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from "../../service/HttpService";
import MainContext from '../context/MainContext';
import SuccessPeymentDialog from '../dialogs/SuccessPeymentDialog';
import PeymentGatewayDialog from '../dialogs/PeymentGatewayDialog';
import { timestampToPersian } from '../../util/DateUtil';
import CashInfoDialog from './CashInfoDialog';

const CashDialog = ({ showDialog , closeDialog , assignNeedyPlanId , planName , planId, loadNeedyForPlan }) => {

console.log('loadNeedyForPlan', loadNeedyForPlan);


    const { setLoadingDialog } = useContext(MainContext)
    const [cashAssistance, setCashAssistance] = useState(0);
    const [successPeymentDialog, setSuccessPeymentDialog] = useState(false);
    const [peymentGatewayDialog, setPeymentGatewayDialog] = useState(false);
    const [cashInfoDialog, setCashInfoDialog] = useState(false)
    const [payPrice, setPayprice] = useState('');

    const getCashAssistanceByAssignNeedyPlanId = () => {
        setLoadingDialog(true)
        HttpService.get(`/api/sunyar/plan/succorCash?planId=${planId}${ loadNeedyForPlan?.length > 0 ? `&assignNeedyPlanId=${assignNeedyPlanId}` : '' }`).then(res => {
            if (res.status === 200) {
                setCashAssistance(res.data);
                console.log('cashAssistance', res.data);

               
            }

        }).catch((ex) => { console.log(ex); })
        setLoadingDialog(false)
    }

    useEffect(() => {
        getCashAssistanceByAssignNeedyPlanId(assignNeedyPlanId)
    }, []);

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
                    width: '750px',
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
                        setCashInfoDialog={setCashInfoDialog}
                        planName={planName}
                    /> : null}

                <div className="container row">

                { cashAssistance == 0 ? null :  <>
                    <div className="col-md-12">

                        <div className=" d-flex flex-column justify-content-center align-items-center mb-4">
                            <p className="border-bottom w-100 text-right pb-3 pr-0"><span className="m-1 h6">کمک نقدی</span></p>

                                {cashAssistance.length !== 0 ? <>
                                    <div className="d-flex w-100 bg-input-dialog mt-3">

                                        <p className="text-right mb-0"><span className=" mx-1 "> نام طرح :</span></p>
                                        <p className="text-right mb-0 mr-2">{planName}</p>

                                    </div>

                                    {cashAssistance[0]?.tblAssignNeedyToPlan ?
                                        <div className="d-flex w-100 bg-input-dialog mt-3">

                                            <p className="text-right mb-0"><span className="mx-1"> اطلاعات نیازمند:</span></p>
                                            {` جنسیت (${cashAssistance[0]?.tblAssignNeedyToPlan?.tblPersonal?.sex ? 'زن' : 'مرد'}) - تاریخ تولد (${cashAssistance[0]?.tblAssignNeedyToPlan?.tblPersonal?.birthDate ? timestampToPersian(new Date(cashAssistance[0]?.tblAssignNeedyToPlan?.tblPersonal?.birthDate).getTime()) : null}) `}

                                        </div>
                                        : null}

                                    <div className=" d-flex w-100 justify-content-center align-items-center" >
                                        <input type="text" id="ownerName" name="ownerName" className="bg-input-dialog-brial mt-3" readOnly placeholder={`مبلغ مورد نیاز:  ${cashAssistance[0]?.neededPrice}`} />
                                        <span className="bg-input-dialog-rial mt-3 ml-1">ریال</span>
                                        <input type="text" id="cardNumber" name="cardNumber" className="bg-input-dialog-brial mt-3 mr-1" readOnly placeholder={`حداقل مبلغ مجاز:  ${cashAssistance[0]?.minPrice}`} />
                                        <span className="bg-input-dialog-rial mt-3">ریال</span>
                                    </div>

                                    <textarea type="text" id="description" name="description" className="w-100 bg-input-dialog mt-3" placeholder="توضیحات" readOnly defaultValue={cashAssistance[0]?.description} />

                                </> : <p>کمکی برای نیازمند انتخاب شده تعریف نگردیده است!</p>}

                        </div>

                        {cashAssistance.length !== 0 ?
                            <div>
                                <button className=' mybtn_dialog_cash px-5 py-1 mr-1' onClick={() => setCashInfoDialog(true)}>
                                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                                </button>
                                <button className='mybtn_dialog px-5 py-1 mr-1' onClick={closeDialog}>
                                    <i class="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </div> : null}

                        {
                            cashInfoDialog ?
                                <CashInfoDialog
                                    planName={planName}
                                    cashAssistance={cashAssistance[0]}
                                    showDialog={cashInfoDialog}
                                    closeDialog={() => setCashInfoDialog(false)}
                                /> : null
                        }

                    </div>
                    </>  }
                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default CashDialog;