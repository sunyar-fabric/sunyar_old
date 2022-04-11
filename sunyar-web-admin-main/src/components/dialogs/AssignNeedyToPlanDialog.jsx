import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import Pagination from '../common/PaginationServer';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';

const AssignNeedyToPlanDialog = ({ showDialog, closeDialog, planInfo }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [needys, setNeedys] = useState([])
    const [needysAssignedToPlan, setNeedysAssignedToPlan] = useState([])
    const [idsForAssignNeedyToPlan, setIdsForAssignNeedyToPlan] = useState([])
    const [assignNeedyPlanId, setAssignNeedyPlanId] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)
    const [bd, setFx] = useState(100)


    console.log('planInfo', planInfo);

    const getNeedys = async () => {

        setLoadingDialog(true)

        try {
            let { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalPagination?page=${currentPage - 1}&personType=2`)
            if (status === 200) {
                setCount(headers['count'])
            }

            let res = await HttpService.get(`/api/sunyar/plan/needyToPlan?planId=${planInfo.planId}`)
            if (res.status === 200) {
                res.data.map(a => data = data.filter(b => b.personId !== a.needyId))
                setNeedys(data)
                setNeedysAssignedToPlan(res.data)
                console.log('res.data', res.data);
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleSetIdsForAssignNeedyToPlan = (id, i) => {
        let copy = [...idsForAssignNeedyToPlan]
        copy.push(id)
        setIdsForAssignNeedyToPlan(copy)
        document.getElementById(i).style.color = 'green'
    }

    const handleSetIdForRemoveNeedyToPlan = (personId, assignNeedyPlanId) => {
        setAssignNeedyPlanId(assignNeedyPlanId)
        document.getElementById(personId).style.color = 'red'
    }

    const handleAssignNeedyToPlan = async () => {
        let datef = document.getElementById('startTime').value.split('/')
        const startTime =  persianToTimestamp(parseInt(fixNumbers(datef[0])), parseInt(fixNumbers(datef[1])), parseInt(fixNumbers(datef[2])))
        let datet = document.getElementById('endTime').value.split('/')
        const endTime =  persianToTimestamp(parseInt(fixNumbers(datet[0])), parseInt(fixNumbers(datet[1])), parseInt(fixNumbers(datet[2])))

        const body = { planId: planInfo.planId, needyId: idsForAssignNeedyToPlan, fDate: startTime, tDate: endTime }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post(`/api/sunyar/plan/needyToPlan`, body)
            if (status === 200) {
                getNeedys()
                let copy = [...needys]
                idsForAssignNeedyToPlan.map(a => copy = copy.filter(b => b.personId !== a))
                setNeedys(copy)
                setIdsForAssignNeedyToPlan([])
                document.getElementById(planInfo.planId).remove()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    const handleRemoveNeedyToPlan = async () => {
        setLoadingDialog(true)
        try {
            let { status } = await HttpService.delete(`/api/sunyar/plan/needyToPlan/${assignNeedyPlanId}`)
            if (status === 204) {
                getNeedys()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        getNeedys()
    }, [currentPage]);

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
                maxWidth: '155rem',
                margin: 'auto'
            }}>

                <div className="d-flex flex-column justify-content-center align-items-center">
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> تخصیص نیازمند به طرح</span></p>

                    <div className="d-flex bg-input-dialog">
                        <p className="text-right mb-0"><span className=""> عنوان :</span></p>
                        <input type="text" id="planName" name="planName" className="flex-grow-1 border-0 rounded mr-3 pr-2 outline-none" readOnly defaultValue={planInfo.planName} />
                    </div>

                    <div className="row mt-2 w-100 mx-0 justify-content-center">

                        <div className='col-5 '>

                            <p className='text-right mt-2 font-weight-bolder text-grey'>لیست نیازمندان</p>

                            {needys && needys.length > 0 ?

                                <ul className='list-group'>
                                    {needys.map(
                                        (needy, index) =>

                                            <li onClick={() => handleSetIdsForAssignNeedyToPlan(needy.personId, index)} id={index} className={`list-group-item text-right cursor-pointer ${false ? 'font-weight-bolder' : ''}`}>
                                                {`${needy.name} ${needy.family}`}
                                            </li>
                                    )}
                                </ul>
                                : <p className="text-center">اطلاعاتی جهت نمایش وجود ندارد</p>}

                            {needys && count > 12 ?
                                <Pagination
                                    total={count}
                                    currentPage={currentPage}
                                    perPage={12}
                                    onPageChange={(page) => setCurrentPage(page)}
                                /> : null}
                        </div>



                        <div className="col-1 d-flex flex-column align-items-center justify-content-center">
                            <i className="fa fa-2x text-success fa-arrow-circle-left cursor-pointer mb-2" aria-hidden="true" onClick={handleAssignNeedyToPlan}></i>
                            <i className="fa fa-2x text-danger fa-arrow-circle-right cursor-pointer" aria-hidden="true" onClick={handleRemoveNeedyToPlan}></i>
                        </div>

                        <div className='col-5'>
                            <p className='text-right mt-2 text-grey font-weight-bolder'> نیازمندان تخصیص یافته به طرح</p>

                            {needysAssignedToPlan && needysAssignedToPlan.length > 0 ?

                                <ul className='list-group'>

                                    {needysAssignedToPlan.map(

                                        (a) =>

                                            <li onClick={() => handleSetIdForRemoveNeedyToPlan(a?.tblPersonal?.personId, a?.assignNeedyPlanId)} id={a?.tblPersonal?.personId} className={`list-group-item text-right cursor-pointer ${false ? 'font-weight-bolder' : ''}`}>
                                                {`${a?.tblPersonal.name} ${a?.tblPersonal.family}`}
                                            </li>

                                    )}

                                </ul>

                                : <p className="text-center">نیازمندی به طرح موردنظر تخصیص نیافته است!</p>}
                        </div>


                    </div>

                    <div className='d-flex justify-content-between w-100 ' >

                        <div className="d-flex bg-input-dialog m-5 ">
                            <span className="text-right m-0 pt-1" style={{ width: '130px' }}> تاریخ شروع :</span>
                            <DatePicker
                                value={ needysAssignedToPlan?.fDate ? needysAssignedToPlan?.fDate : new Date(planInfo?.fDate).getTime()}
                                minDate={timestampToPersian(new Date(planInfo?.fDate).getTime())}
                                type='text'
                                editable={false}
                                locale={persian_fa}
                                calendar={persian}
                                inputMode='none'
                                inputClass=' bg-input-dialog1 p-1 '
                                containerClassName="w-100"
                                placeholder="تاریخ انقضا "
                                id="startTime"
                                multiple={false} />
                        </div>

                        <div className="d-flex bg-input-dialog m-5 ">
                            <span className="text-right  m-0 pt-1" style={{ width: '130px' }}> تاریخ پایان :</span>
                            <DatePicker
                                value={needysAssignedToPlan?.tDate ? needysAssignedToPlan?.tDate : new Date(planInfo?.tDate).getTime()}
                                maxDate={timestampToPersian(new Date(planInfo?.tDate).getTime())}
                                type='text'
                                editable={false}
                                locale={persian_fa}
                                calendar={persian}
                                inputMode='none'
                                inputClass=' bg-input-dialog1 p-1 '
                                containerClassName="w-100"
                                placeholder="تاریخ انقضا "
                                id="endTime"
                                multiple={false} />
                        </div>

                    </div>

                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default AssignNeedyToPlanDialog;