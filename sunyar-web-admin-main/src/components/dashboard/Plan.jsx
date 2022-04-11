import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../context/MainContext';
import pencilIcon from '../../static/image/pencilIcon.png';
import trashIcon from '../../static/image/trashIcon.png';
import chevron from '../../static/image/chevron.png';
import Accordion from '../common/Accordion';
import CreatePlanDialog from '../dialogs/CreatePlanDialog';
import HttpService from '../../service/HttpService';
import EditPlanDialog from '../dialogs/EditPlanDialog';
import DeletePlanDialog from '../dialogs/DeletePlanDialog';
import { toastError } from '../../util/ToastUtil';

const Plan = () => {

    const { setLoadingDialog } = useContext(MainContext)
    const [plans, setPlans] = useState([]);
    const [planInfo, setPlanInfo] = useState({});
    const [planId, setPlanId] = useState(null);
    const [createPlanDialog, setCreatePlanDialog] = useState(false);
    const [editPlanDialog, setEditPlanDialog] = useState(false);
    const [deletePlanDialog, setDeletePlanDialog] = useState(false);

    const borderStyle = { borderBottom: '2px dashed #36c6d369', maxWidth: '220px', marginTop: '35px' }

    const handleEditPlan = (plan) => {
        setEditPlanDialog(true)
        setPlanInfo(plan)
    }

    const handleDeletePlan = (id) => {
        setDeletePlanDialog(true)
        setPlanId(id)
    }

    const handleCreatePlanDialog = async (id = null) => {
        if (id === null) {
            setPlanId(id)
            setCreatePlanDialog(true)
            return
        }
        setLoadingDialog(true)
        let res = await HttpService.get(`/api/sunyar/plan/needyToPlan?planId=${id?.planId}`)
        if (res.status === 200) {
            setLoadingDialog(false)
            if (res.data.length > 0) {
                toastError('به دلیل تخصیص نیازمند به طرح امکان افزودن طرح وجود ندارد!')
            } else {
                setCreatePlanDialog(true)
                setPlanInfo(id)
                setPlanId(id?.planId)
            }
        }
    }

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

    const getAssignNeedysToPlanByPlanId = async () => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/plan/plan/planTree`)
            if (status === 200) {
                setPlans(data[0].get_tree)
            }
        } catch (error) { }
        setLoadingDialog(false)

    }

    useEffect(() => {
        getPlans()
    }, []);

    return (

        <div className="d-flex flex-column ">

            {createPlanDialog ?
                <CreatePlanDialog
                    planInfo={planInfo}
                    planId={planId}
                    getPlans={getPlans}
                    showDialog={createPlanDialog}
                    closeDialog={() => setCreatePlanDialog(false)}
                /> : null}

            {editPlanDialog ?
                <EditPlanDialog
                    planInfo={planInfo}
                    getPlans={getPlans}
                    showDialog={editPlanDialog}
                    closeDialog={() => setEditPlanDialog(false)}
                /> : null}

            {deletePlanDialog ?
                <DeletePlanDialog
                    planId={planId}
                    getPlans={getPlans}
                    showDialog={deletePlanDialog}
                    closeDialog={() => setDeletePlanDialog(false)}
                /> : null}

            <button className="d-flex align-items-center admin-btn text-white text-left align-self-end m-3 mx-4" onClick={() => handleCreatePlanDialog()}>
                <i className="fa fa-plus bg-pluse"></i>
                <p className="mb-0 mr-2 ml-5 my-1">افزودن</p>
            </button>

            <div className='m-2'>
                {plans && plans.length > 0 ?
                    <>
                        <div className="mx-5 mb-3">
                            <ul className="list-group list-group-flush " style={{ color: "rgb(0,0,0)" }} >

                                {plans.map(

                                    (plan, index) =>

                                        <>
                                            {!plan.parentPlanId ?
                                                <>
                                                    <Accordion state='plan' className="my-4 font-weight-bolder" title={plan.planName}>
                                                        <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} alt="" onClick={() => handleEditPlan(plan)} />
                                                        <img className="bg-danger rounded p-1 cursor-pointer mx-1" src={trashIcon} alt="" onClick={() => handleDeletePlan(plan.planId)} />
                                                        <i className="fa fa-plus-circle bg-info padding-025rem-025rem-04rem rounded text-white cursor-pointer" onClick={() => handleCreatePlanDialog(plan)}></i>
                                                        <div className="d-flex flex-column border-right-plan">

                                                            {plan?.children?.length > 0 ?
                                                                <>
                                                                    {plan.children.map((a, index) =>
                                                                        <>
                                                                            <canvas id="myCanvas1" width="100" height="5" style={borderStyle}></canvas>
                                                                            <Accordion state='plan' logoImage={chevron} className="cursor-pointer mr-11 font-weight-normal" title={`${a.planName}`} childs={a} isChild={true} to="/" >
                                                                                <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} alt="" onClick={() => handleEditPlan(a)} />
                                                                                <img className="bg-danger rounded p-1 cursor-pointer mx-1" src={trashIcon} alt="" onClick={() => handleDeletePlan(a.planId)} />
                                                                                <i className="fa fa-plus-circle bg-info padding-025rem-025rem-04rem rounded text-white cursor-pointer" onClick={() => handleCreatePlanDialog(a)} ></i>
                                                                                <div className="d-flex flex-column border-right-plan">
                                                                                    
                                                                                    {plan?.children[index]?.children.length > 0 ?
                                                                                        <>
                                                                                            {plan.children[index]?.children.map(a =>
                                                                                                <>
                                                                                                    <canvas id="myCanvas" width="100" height="5" style={borderStyle}></canvas>
                                                                                                    <Accordion state='plan' logoImage={chevron} className="cursor-pointer mr-11 font-weight-lighter" title={`${a.planName}`} childs={a} isChild={true} to="/" >
                                                                                                        <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} alt="" onClick={() => handleEditPlan(a)} />
                                                                                                        <img className="bg-danger rounded p-1 cursor-pointer mx-1" src={trashIcon} alt="" onClick={() => handleDeletePlan(a.planId)} />
                                                                                                    </Accordion>
                                                                                                </>
                                                                                            )}
                                                                                        </>

                                                                                        : null}
                                                                                </div>
                                                                            </Accordion>
                                                                        </>)}
                                                                </>
                                                                : null}
                                                        </div>
                                                    </Accordion>
                                                    {plans.length !== (index + 1) ? <div className='devider' /> : null}
                                                </>

                                                : null}
                                        </>
                                )}

                            </ul>
                        </div>

                    </>

                    : <h2 className="text-center mt-5">اطلاعاتی جهت نمایش وجود ندارد!</h2>}

            </div>

        </div>
    );
}

export default Plan;