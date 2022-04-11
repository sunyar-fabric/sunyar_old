import React, { useState } from "react";
import { useHistory } from "react-router";

const Accordion = ({ title, children, className, icon, isChild, childs, collapsedIcon, getPlanInfoById, getLoadNeedyForPlan, select , setSelect  }) => {

    const history = useHistory()

    const [isOpen, setOpen] = useState(false);
    


    const handleGetPlanInfoById = (planId) => {

        console.log('planId', planId);
        
        setSelect(planId)
        getPlanInfoById(planId)
        getLoadNeedyForPlan(planId)

    }


    return (
        <div>
            <div className={`accordion-wrapper mt-0 ${className}`}>
                <div className={`d-flex accordion-title-plan ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>

                    <div className={`d-flex align-items-center w-100 p-2 settelment ${ select === childs.planId ? 'select-color' : ""}  `} id={childs.planId} onClick={() => handleGetPlanInfoById(childs.planId)}>
                        {!isOpen ? icon : collapsedIcon}
                        <span className={`mr-2 ${isChild ? '' : ''}`} style={{ margin: '5px 10px' }}>{title}</span>
                    </div>

                </div>
                <div className={`accordion-item ${!isOpen ? "collapsed text-info" : ""}`}>
                    <div className="accordion-content-plan">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
