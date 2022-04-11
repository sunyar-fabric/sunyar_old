import React from 'react';
import { NavLink } from 'react-router-dom';
import Accordion from '../common/Accordion';
import baseInfoLogo from "../../static/image/baseInfoLogo.png";
import managementUserLogo from "../../static/image/managementUserLogo.png";
import managementCharityLogo from "../../static/image/managementCharityLogo.png";
import managementPlansLogo from "../../static/image/managementPlansLogo.png";

import managementcalculatorLogo from "../../static/image/managementcalculatorLogo.png";
import { useTranslation} from "react-i18next";


const Menu = () => {

    const faChevronDown = <i className="fa fa-chevron-down font-size-small" aria-hidden="true"></i>
    const faChevronUp = <i className="fa fa-chevron-up font-size-small" aria-hidden="true"></i>

    let role0 = localStorage.getItem('role0')
    let role1 = localStorage.getItem('role1')
    let role2 = localStorage.getItem('role2')

    const { t } = useTranslation()

    return (
        <div className='menu'>

            {role0 == 1 || role1 == 1 || role2 == 1 ?
                <>
                    <Accordion state={'menu'} className="mt-4" title={t('Basic_Information')} logoImage={baseInfoLogo} icon={faChevronDown} collapsedIcon={faChevronUp}>
                        <div className="d-flex flex-column">
                            <NavLink className="my-2 text-start1 " to="/baseInfo/commonBaseType" activeClassName="text-warning">{t('constant_values')} </NavLink>
                            <NavLink className="my-2 text-start1" to="/baseInfo/charityAccount" activeClassName="text-warning">{t('Charity_accounts')}</NavLink>
                        </div>
                    </Accordion>

                    <Accordion state={'menu'} className="" title={t('User_management')} logoImage={managementUserLogo} icon={faChevronDown} collapsedIcon={faChevronUp} >
                        <div className="d-flex flex-column">
                            <NavLink className="my-2 text-start1" to="/userManagement/personal" activeClassName="text-warning">{t('Individuals')} </NavLink>
                            <NavLink className="my-2 text-start1" to="/userManagement/roles" activeClassName="text-warning"> {t('Role_definition')}  </NavLink>
                            <NavLink className="my-2 text-start1" to="/userManagement/users" activeClassName="text-warning"> {t('User')}</NavLink>
                        </div>
                    </Accordion>
                </>
                : null}

               {role0 == 1 || role1 == 1 || role2 == 1 || role0 == 3 || role1== 3 ?

                <>
                    <Accordion state={'menu'} className="" title={t('Needy_management')} logoImage={managementCharityLogo} icon={faChevronDown} collapsedIcon={faChevronUp}>
                        <div className="d-flex flex-column">
                            <NavLink className='my-2 text-start1' to="/beneficiary/needyDefine" activeClassName="text-warning">{t('Needy_Definition')} </NavLink>
                        </div>
                    </Accordion>

                    <Accordion state={'menu'} className="" title={t('projects_management')} logoImage={managementPlansLogo} icon={faChevronDown} collapsedIcon={faChevronUp}>
                        <div className="d-flex flex-column">
                            <NavLink className='my-2 text-start1' to="/plan" activeClassName="text-warning">{t('Plan_Definition')} </NavLink>
                        </div>
                    </Accordion>
                </>
                : null}

               {role0 == 1 || role1 == 1 || role2 == 1 || role0 == 2 || role1 == 2 ?

                <Accordion state={'menu'} className="" title={t('Accounting_management')} logoImage={managementcalculatorLogo} icon={faChevronDown} collapsedIcon={faChevronUp}>
                    <div className="d-flex flex-column">
                        <NavLink className='my-2 text-start1' to="/operation/settelment"  activeClassName="text-warning">{t('settlement')}</NavLink>
                    </div>
                </Accordion>
                :
                null
            }

        </div>
    );
}

export default Menu;