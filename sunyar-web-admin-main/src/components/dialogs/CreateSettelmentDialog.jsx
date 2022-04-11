import React, { useContext, useRef, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import DatePicker from 'react-multi-date-picker';
import Accordion from '../common/Accordion';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";


const CreateSettelmentDialog = ({ showDialog, closeDialog, plans, chevron, faChevronLeft, faChevronDown, getAssignedNeedysForPlan }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [tx, setTx] = useState(100)
    const [fx, setFx] = useState(100)

    const handleCreateSettelment = async () => {

        let body = {}

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post('/api/sunyar/operation/settelment', body)
            if (status === 200) {
                toastSuccess('طرح با موفقیت ایجاد گردید!')
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
            <DialogContent
                className='mx-1'
                style={{
                    borderRadius: '10px',
                    boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)',
                    height: 'unset',
                    width: '110rem',
                    maxWidth: '2000px',
                    margin: 'auto',
                }}>

                <div className="container d-flex flex-column justify-content-center align-items-center">

                    <p className="border-bottom w-100 text-right pb-3 w-100"><span className="m-3"> ایجاد تسویه</span></p>

                    <div className="col-6 d-flex flex-column align-self-start mx-3 mt-2">

                        <p className='text-right'>طرح‌ها:</p>

                        {plans.length > 0 ?

                            <ul className="rounded bg-white px-0" >

                                {plans.map(

                                    (plan, index) =>

                                        <>
                                            {!plan.parentPlanId ?
                                                <Accordion state='settelment' className={`p-2 ${plans.length !== (index + 1) ? 'border-bottom' : ''}`} childs={plan} title={plan.planName} icon={faChevronLeft} collapsedIcon={faChevronDown} getAssignedNeedysForPlan={getAssignedNeedysForPlan}>
                                                    <div className="d-flex flex-column">
                                                        {plan?.children?.length > 0 ?
                                                            <>
                                                                {plan.children.map((a, index) =>
                                                                    <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                        <div className="d-flex flex-column">
                                                                            {plan?.children[index]?.children.length > 0 ?
                                                                                <>
                                                                                    {plan.children[index]?.children.map(a =>
                                                                                        <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                                        </Accordion>)}
                                                                                </>
                                                                                : null}
                                                                        </div>
                                                                    </Accordion>)}
                                                            </>
                                                            : null}
                                                    </div>
                                                </Accordion>
                                                : null}
                                        </>

                                )}
                            </ul>

                            :
                            <p>اطلاعاتی جهت نمایش وجود ندارد!</p>}
                    </div>

                    <input type="text" id="planName" name="planName" className="bg-input-dialog mt-3 w-100" placeholder="عنوان اصلی" />

                    <div className="mt-3 w-100">
                        <DatePicker
                            zIndex={fx}
                            onFocusedDateChange={() => setFx(-100)}
                            onOpen={() => setFx(100)}
                            locale={persian_fa}
                            calendar={persian}
                            inputMode='none'
                            inputClass='w-100 bg-input-dialog'
                            containerClassName="w-100 z"
                            placeholder="تاریخ شروع طرح "
                            id="fDate"
                            multiple={false} />
                    </div>

                    <div className="mt-3 w-100">
                        <DatePicker
                            zIndex={tx}
                            onFocusedDateChange={() => setTx(-100)}
                            onOpen={() => setTx(100)}
                            locale={persian_fa}
                            calendar={persian}
                            inputMode='none'
                            inputClass='w-100 bg-input-dialog'
                            containerClassName="w-100"
                            placeholder="تاریخ پایان طرح "
                            id="tDate"
                            multiple={false} />
                    </div>

                    <div class="bg-input-dialog d-flex p-0 mt-3 w-100">
                        <span class="border border-radius-0-05rem-05rem-0 p-2"> ماهیت طرح </span>
                        <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="planNature" name="planNature">
                            <option value={true}>نقدی</option>
                            <option value={false}>غیرنقدی</option>
                        </select>
                    </div>

                    <div class="bg-input-dialog d-flex p-0 mt-3 w-100">
                        <span class="border border-radius-0-05rem-05rem-0 p-2"> نیاز به لاگین </span>
                        <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="neededLogin" name="neededLogin">
                            <option value={true}>دارد</option>
                            <option value={false}>ندارد</option>
                        </select>
                    </div>

                    <textarea type="text" id="description" name="description" className="bg-input-dialog mt-3 pb-5 w-100" placeholder="توضیحات" />

                    <div className="d-flex mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleCreateSettelment}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default CreateSettelmentDialog;