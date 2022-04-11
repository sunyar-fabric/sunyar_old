import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../context/MainContext';
import CashDialog from './CashDialog';
import Accordion from '../common/Accordion';
import logoFolder from '../../static/image/logoFolder.png';
import chevron from '../../static/image/chevron.png';
import HttpService from '../../service/HttpService';
import { timestampToPersian } from '../../util/DateUtil';
import { useHistory } from 'react-router';

const Helpform = () => {

    const history = useHistory()
    const { setLoadingDialog } = useContext(MainContext)
    const [assignNeedyPlanId, setAssignNeedyPlanId] = useState('');
    const [planId, setPlanId] = useState('');
    const [planName, setPlanName] = useState('');
    const [loadNeedyForPlan, setLoadNeedyForPlan] = useState([]);
    const [planInfo, setPlanInfo] = useState([]);
    const [plans, setPlans] = useState([]);
    const [cashDialog, setCashDialog] = useState(false)
    const [select, setSelect] = useState();

    const getPlans = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/plan/plan/planTree`)
            if (status === 200) {
                setPlans(data[0].get_tree)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const faChevronDown = <i className="fa fa-chevron-down font-size-10px" aria-hidden="true"></i>
    const faChevronLeft = <i className="fa fa-chevron-left font-size-10px" aria-hidden="true"></i>

    const getPlanInfoById = async (id) => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/plan/plan?planId=${id}`)
            if (status === 200) {
                data[0].neededLogin && !localStorage.getItem('token') ? history.push('/signup/login/planUrl') :
                    setPlanInfo(data)
                console.log(' planinfo ', data);
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const getLoadNeedyForPlan = async (planId) => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/plan/needyToPlan?planId=${planId}`)

            if (status === 200) {
                setLoadNeedyForPlan(data)
                setPlanId(planId)
             
                console.log('datadata', data);
            }
            
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleGoToCashDialog = async (id, planId, planName) => {
        setAssignNeedyPlanId(id)
        setPlanId(planId)
        setPlanName(planName)
    }

    useEffect(() => {
        getPlans()
    }, []);

    return (

        <div className='my-4 mx-5'>
            <div className='row mx-auto mb-4'>
                <div className='col-12 col-md-4 my-2'>

                    <div className="card border my_card ">
                        <p className='text-center rounded-top mt-0  mb-3 bg-header-table border-gray'>انتخاب طرح‌</p>

                        {plans.length > 0 ?

                            <ul className="list-group mb-1 list-group-flush" >

                                {plans.map(

                                    (plan, index) =>

                                        <>
                                            {!plan.parentPlanId ?
                                                <Accordion key={index} logoImage={logoFolder} className={`p-0 ${plans.length !== (index + 1) ? 'border-bottom' : ''}`} planTree={plans} childs={plan} title={plan.planName} icon={faChevronLeft} collapsedIcon={faChevronDown} getPlanInfoById={getPlanInfoById} setSelect={setSelect} select={select} getLoadNeedyForPlan={getLoadNeedyForPlan}>
                                                    <div className="d-flex border-0 flex-column">
                                                        {plan?.children?.length > 0 && !plan?.children?.neededLogin === true ?
                                                            <>
                                                                {plan.children.map((a, index) =>
                                                                    <Accordion key={index} logoImage={chevron} className="cursor-pointer me-5" title={`${a.planName}`} planTree={plans} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} getPlanInfoById={getPlanInfoById} setSelect={setSelect} select={select} getLoadNeedyForPlan={getLoadNeedyForPlan} to="/" >
                                                                        <div className="d-flex flex-column">
                                                                            {plan?.children[index]?.children.length > 0 && !plan?.children[index]?.children.neededLogin === true ?
                                                                                <>
                                                                                    {plan.children[index]?.children.map((a, index) =>
                                                                                        <Accordion key={index} logoImage={chevron} className="cursor-pointer me-5" planTree={plans} title={`${a.planName}`} childs={a} isChild={true} to="/" icon={faChevronLeft} collapsedIcon={faChevronDown} getPlanInfoById={getPlanInfoById} setSelect={setSelect} select={select} getLoadNeedyForPlan={getLoadNeedyForPlan} >
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
                </div>

                <div className='col-12 col-md-4 my-2'>
                    <div className="card border my_card">
                        <p className="text-center border-bottom pb-3 mb-0"> توضیحات</p>
                        {planInfo ?
                            <p className="m-2 text-justify theme-color"> {planInfo[0]?.description}</p>
                            : <p>طرحی انتخاب نگردیده است!</p>}
                    </div>
                </div>

                <div className='col-12 col-md-4 my-2'>
                    <div className="card border my_card">
                        <p className="text-center pb-3 mb-0"> انتخاب نیازمند جهت کمک</p>
                        <ul className="list-group list-group-flush mb-3" style={{ color: "rgb(0,0,0)" }} >
                            {loadNeedyForPlan.length ?
                                <>
                                    {loadNeedyForPlan.map((a, index) =>

                                        <li key={index} className={`list-group-item text-right cursor-pointer p-3 myli ${assignNeedyPlanId === a.assignNeedyPlanId ? 'bg-btn-color text-white rounded' : ''}`} id={a.assignNeedyPlanId} onClick={() => handleGoToCashDialog(a.assignNeedyPlanId, a.planId, a.planName)}>
                                            {` جنسیت (${a?.tblPersonal?.sex ? 'زن' : 'مرد'}) - تاریخ تولد (${a?.tblPersonal?.birthDate ? timestampToPersian(new Date(a.tblPersonal.birthDate).getTime()) : null})`}
                                        </li>
                                    )}
                                </>
                                : null}
                        </ul>
                    </div>
                </div>

            </div>

            {
                cashDialog ?
                    <CashDialog
                        planName={planName}
                        assignNeedyPlanId={assignNeedyPlanId}
                        planId={planId}
                        showDialog={cashDialog}
                        closeDialog={() => setCashDialog(false)}
                        loadNeedyForPlan={loadNeedyForPlan}
                    /> : null
            }

            <div className='d-flex mx-auto mb-4 w-100 justify-content-center'>
                <button className='mybtn_cash  mx-2 text-center' onClick={() => setCashDialog(true)}>کمک نقدی</button>
                {/* <button className='mybtn mx-2 text-center '>کمک غیرنقدی</button> */}
            </div>

        </div >
    )
}

export default Helpform;