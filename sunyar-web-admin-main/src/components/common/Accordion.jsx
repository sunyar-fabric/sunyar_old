import React, { useState } from "react";
import PlanInfoDialog from "../dialogs/PlanInfoDialog";


const Accordion = ({ title, children, className, logoImage, state, isChild, childs, icon, collapsedIcon, getAssignedNeedysForPlan, select, setSelect }) => {

    const [planInfoDialog, setPlanInfoDialog] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const handlePlanInfoDialog = () => {

        if (isChild && childs?.children?.length === 0)
            setPlanInfoDialog(true)
    }

    const handleGetAssignedNeedysForPlan = () => {
        if (isChild && childs?.children?.length === 0) {
            getAssignedNeedysForPlan(childs?.planId)
            setSelect(childs?.planId)
        }

    }

    function selectedItem() {
        setOpen(!isOpen)
    }

    return (

        <>
            {planInfoDialog ?
                <PlanInfoDialog
                    childs={childs}
                    showDialog={planInfoDialog}
                    closeDialog={() => setPlanInfoDialog(false)}
                /> : null}

            {(() => {
                switch (state) {
                    case 'menu':

                        return <div className={`accordion-wrapper  ${className}`}>

                            <div className={`accordion-title ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <img className="mx-2 max-dim-icon-menu" src={logoImage} alt="baseInfoLogo" />
                                        {title}
                                    </div>
                                    {!isOpen ? icon : collapsedIcon}
                                </div>
                            </div>

                            <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
                                <div className="accordion-content">{children}</div>
                            </div>

                        </div>

                    case 'settelment':

                        return <div className={`accordion-wrapper mt-0 ${className}`}>

                            <div className={`d-flex accordion-title-plan ${isOpen ? "open" : ""}`} onClick={selectedItem}>
                                <div className={`d-flex align-items-center w-100 p-2 settelment ${select === childs.planId ? 'select-color' : ""} `} onClick={handleGetAssignedNeedysForPlan}>
                                    {!isOpen ? icon : collapsedIcon}
                                    <span className={`mr-2 ${isChild ? '' : ''}`}>{title}</span>
                                </div>
                            </div>

                            <div className={`accordion-item ${!isOpen ? "collapsed text-info" : ""}`}>
                                <div className="accordion-content-plan">{children}</div>
                            </div>

                        </div>

                    case 'plan':

                        return <div className={`accordion-wrapper ${className}`}>

                            <div className={`d-flex accordion-title-plan ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>
                                <div className="d-flex align-items-center justify-content-between w-100" onClick={handlePlanInfoDialog}>
                                    <span className={`${isChild ? 'child-hover-plan' : 'plan-accordion'}`}>{title}</span>
                                </div>
                            </div>

                            <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
                                <div className="accordion-content-plan mb-3">{children}</div>
                            </div>

                        </div>
                    default:
                        break;
                }
            })()}

        </>
    );
};


export default Accordion;
